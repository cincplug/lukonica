import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { findClosestFacePointIndex, getDistance } from "./index";

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setChunks,
  setActiveChunk,
  setCursor
}) => {
  let frame = 0;
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
      const faces = await facesDetector.estimateFaces(video, estimationConfig);
      const hands = await handsDetector.estimateHands(video, estimationConfig);

      let points = [];
      if (showsFaces && faces?.[0]?.keypoints) {
        faces.forEach((face) => {
          points = points.concat(face.keypoints);
        });
      }
      if (showsHands && hands?.[0]?.keypoints) {
        if (!["paths"].includes(pattern)) {
          hands.forEach((hand) => {
            points = points.concat(hand.keypoints);
          });
        }
        const thumbTip = hands[0]?.keypoints[4];
        const indexTip = hands[0]?.keypoints[8];
        const thumbIndexDistance = getDistance(thumbTip, indexTip);
        const threshold = gripThreshold;
        setCursor({
          x: (thumbTip.x + indexTip.x) / 2,
          y: (thumbTip.y + indexTip.y) / 2,
          isActive: thumbIndexDistance < threshold
        });
        const closestPoint = findClosestFacePointIndex({
          facePoints: points,
          indexTip,
          threshold
        });
        if (closestPoint !== null && thumbIndexDistance < threshold) {
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
      setPoints(points);
    }
    frame++;
    requestAnimationFrame(detect);
  };

  detect();
};
