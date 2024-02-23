import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { findClosestFacePointIndex, getDistance, processColor } from "./index";
import { op } from "@tensorflow/tfjs";

const CANVAS_LINE_WIDTH_MODIFIER = 0.05;

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setCustomMask,
  setCustomMaskNewArea,
  setCursor,
  setHandsCount,
  setScribbleNewArea
}) => {
  let frame = 0;
  let shouldContinue = true;
  let animationFrameId;

  const facesModel = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const facesDetectorConfig = {
    runtime: "tfjs",
    refineLandmarks: false
  };
  const facesDetector = await faceLandmarksDetection.createDetector(
    facesModel,
    facesDetectorConfig
  );

  const handsModel = handPoseDetection.SupportedModels.MediaPipeHands;
  const handsDetectorConfig = {
    runtime: "tfjs",
    modelType: "lite"
  };
  const handsDetector = await handPoseDetection.createDetector(
    handsModel,
    handsDetectorConfig
  );

  const detect = async () => {
    const {
      showsFaces,
      showsHands,
      pinchThreshold,
      minimum,
      latency,
      pattern,
      usesButtonPinch,
      color,
      opacity,
      radius,
      growth
    } = setupRef.current;
    if (frame % latency === 0) {
      const estimationConfig = { flipHorizontal: true, staticImageMode: false };
      let faces, hands;
      try {
        faces = showsFaces
          ? await facesDetector.estimateFaces(video, estimationConfig)
          : null;
        hands = await handsDetector.estimateHands(video, estimationConfig);
      } catch (error) {
        console.error("Error estimating faces or hands", error);
        return;
      }

      let points = [];
      if (showsFaces && faces?.length) {
        faces.forEach((face) => {
          if (face.keypoints) {
            points = points.concat(face.keypoints);
          }
        });
        const foreheadTop = faces[0]?.keypoints[10];
        const eyebrowMid = faces[0]?.keypoints[8];
        const noseRoot = faces[0]?.keypoints[168];
        const muzzle = faces[0]?.keypoints[151];
        const surpriseThreshold = 0.17;
        setCursor((prevCursor) => {
          return {
            ...prevCursor,
            muzzle:
              (noseRoot.y - eyebrowMid.y) / (noseRoot.y - foreheadTop.y) >
              surpriseThreshold
                ? muzzle
                : null
          };
        });
      }
      if (showsHands && hands?.length) {
        if (!["paths"].includes(pattern)) {
          hands.forEach((hand) => {
            if (hand.keypoints) {
              points = points.concat(hand.keypoints);
            }
          });
        }
        const wrist = hands[0]?.keypoints[0];
        const thumbTip = hands[0]?.keypoints[4];
        const indexTip = hands[0]?.keypoints[8];
        const middleDip = hands[0]?.keypoints[11];
        const thumbIndexDistance = getDistance(thumbTip, indexTip);
        const isPinched = thumbIndexDistance < pinchThreshold;
        const isWagging =
          !isPinched &&
          (wrist.y - indexTip.y) / (wrist.y - middleDip.y) > 2 &&
          (wrist.y - indexTip.y) / (wrist.x - indexTip.x) > 2;
        const x = (thumbTip.x + indexTip.x) / 2;
        const y = (thumbTip.y + indexTip.y) / 2;
        setCursor((prevCursor) => {
          const threshold = prevCursor.isPinched
            ? pinchThreshold * 2
            : pinchThreshold;
          if (usesButtonPinch && thumbIndexDistance < pinchThreshold * 4) {
            const element = document.elementFromPoint(x, y);
            if (!element) {
              return;
            }
            if (element.tagName === "BUTTON") {
              clearHighlight();
              element.classList.add("highlight");
              if (isPinched) {
                element.click();
                element.classList.remove("highlight");
              }
            } else {
              clearHighlight();
            }
          }
          return {
            x,
            y,
            wrist,
            thumbTip,
            indexTip,
            middleDip,
            isWagging,
            isPinched: thumbIndexDistance < threshold
          };
        });
        const closestPoint = findClosestFacePointIndex({
          facePoints: points,
          indexTip,
          pinchThreshold
        });
        if (!showsFaces && isPinched) {
          setScribbleNewArea((prevScribbleNewArea) => {
            if (
              prevScribbleNewArea.length === 0 ||
              getDistance(
                {
                  x: prevScribbleNewArea[prevScribbleNewArea.length - 1].x,
                  y: prevScribbleNewArea[prevScribbleNewArea.length - 1].y
                },
                { x, y }
              ) > minimum
            ) {
              if (pattern === "canvas") {
                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                ctx.strokeStyle = processColor(color, opacity);
                ctx.lineWidth =
                  radius *
                  growth *
                  thumbIndexDistance *
                  CANVAS_LINE_WIDTH_MODIFIER;

                if (prevScribbleNewArea.length > 0) {
                  ctx.beginPath();
                  prevScribbleNewArea.forEach((point, index) => {
                    ctx.moveTo(point.x, point.y);
                    if (index < prevScribbleNewArea.length - 1) {
                      const nextPoint = prevScribbleNewArea[index + 1];
                      ctx.lineTo(nextPoint.x, nextPoint.y);
                    }
                    ctx.stroke();
                  });
                  return [...prevScribbleNewArea.slice(-1), { x, y }];
                }
              }
              return [...prevScribbleNewArea, { x, y }];
            }
            return prevScribbleNewArea;
          });
        }
        if (showsFaces && closestPoint && isPinched) {
          setCustomMaskNewArea((prevCustomMaskNewArea) => {
            if (
              prevCustomMaskNewArea.length > 0 &&
              prevCustomMaskNewArea[0] === closestPoint
            ) {
              setCustomMask((prevCustomMask) => {
                return [...prevCustomMask, prevCustomMaskNewArea];
              });
              return [];
            } else {
              return [...prevCustomMaskNewArea, closestPoint];
            }
          });
        }
      }
      setHandsCount(hands.length);
      if (points.length) {
        setPoints(points);
      }
    }
    frame++;
    if (shouldContinue) {
      animationFrameId = requestAnimationFrame(detect);
    }
  };

  detect();

  return () => {
    shouldContinue = false;
    cancelAnimationFrame(animationFrameId);
  };
};

const clearHighlight = () => {
  const highlightedElement = document.querySelector(".highlight");
  if (highlightedElement) {
    highlightedElement.classList.remove("highlight");
  }
};
