import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { findClosestFacePointIndex, getDistance } from "./index";

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setCustomMask,
  setCustomMaskNewArea,
  setCursor,
  setHandsCount,
  setScribble,
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
    const { showsFaces, showsHands, pinchThreshold, minimum, latency, pattern } =
      setupRef.current;
    if (frame % latency === 0) {
      const estimationConfig = { flipHorizontal: true, staticImageMode: false };
      let faces, hands;
      try {
        faces = await facesDetector.estimateFaces(video, estimationConfig);
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
      }
      if (showsHands && hands?.length) {
        if (!["paths"].includes(pattern)) {
          hands.forEach((hand) => {
            if (hand.keypoints) {
              points = points.concat(hand.keypoints);
            }
          });
        }
        const thumbTip = hands[0]?.keypoints[4];
        const indexTip = hands[0]?.keypoints[8];
        const middleTip = hands[0]?.keypoints[12];
        const thumbIndexDistance = getDistance(thumbTip, indexTip);
        const isPinched = thumbIndexDistance < pinchThreshold;
        const x = (thumbTip.x + indexTip.x) / 2;
        const y = (thumbTip.y + indexTip.y) / 2;
        setCursor((prevCursor) => {
          const threshold = prevCursor.isPinched
            ? pinchThreshold * 2
            : pinchThreshold;
          return {
            x,
            y,
            thumbTip,
            indexTip,
            middleTip,
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
