import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { findClosestFacePointIndex, getDistance } from "./index";

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setChunks,
  setActiveChunk,
  setCursor,
  setHandsCount,
  setScribble
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
    const { showsFaces, showsHands, gripThreshold, latency, pattern } =
      setupRef.current;
    if (frame % latency === 0) {
      const estimationConfig = { flipHorizontal: true, staticImageMode: false };
      let faces, hands;
      try {
        faces = await facesDetector.estimateFaces(video, estimationConfig);
        hands = await handsDetector.estimateHands(video, estimationConfig);
      } catch (error) {
        console.error('Error estimating faces or hands', error);
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
        const thumbIndexDistance = getDistance(thumbTip, indexTip);
        setCursor((prevCursor) => {
          const threshold = prevCursor.isActive
            ? gripThreshold * 2
            : gripThreshold;
          const thumbTipX = thumbTip.x;
          const thumbTipY = thumbTip.y;
          const indexTipX = indexTip.x;
          const indexTipY = indexTip.y;
          const x = (thumbTipX + indexTipX) / 2;
          const y = (thumbTipY + indexTipY) / 2;

          if (thumbIndexDistance < gripThreshold && !showsFaces) {
            setScribble((prevScribble) => {
              return [...prevScribble, { x, y }];
            });
          }
          return {
            x,
            y,
            thumbTipX,
            thumbTipY,
            indexTipX,
            indexTipY,
            isActive: thumbIndexDistance < threshold
          };
        });
        const closestPoint = findClosestFacePointIndex({
          facePoints: points,
          indexTip,
          gripThreshold
        });
        if (closestPoint !== null && thumbIndexDistance < gripThreshold) {
          setActiveChunk((prevActiveChunk) => {
            if (
              prevActiveChunk.length > 0 &&
              prevActiveChunk[0] === closestPoint
            ) {
              setChunks((prevChunks) => {
                return [...prevChunks, prevActiveChunk];
              });
              return [];
            } else {
              return [...prevActiveChunk, closestPoint];
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
