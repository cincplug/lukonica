import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";

export const runDetector = async (video, setPoints) => {
  const facesModel = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const facesDetectorConfig = {
    runtime: "tfjs",
    refineLandmarks: true
  };
  const facesDetector = await faceLandmarksDetection.createDetector(
    facesModel,
    facesDetectorConfig
  );
  const detectFaces = async (net) => {
    const estimationConfig = { flipHorizontal: true };
    const faces = await net.estimateFaces(video, estimationConfig);
    requestAnimationFrame(() => {
      if (faces && faces[0] && faces[0].keypoints) {
        setPoints(faces[0].keypoints);
      }
    });
    detectFaces(facesDetector);
  };
  detectFaces(facesDetector);
  
  const handsModel = handPoseDetection.SupportedModels.MediaPipeHands;
  const handsDetectorConfig = {
    runtime: "tfjs",
    modelType: "full"
  };
  const handsDetector = await handPoseDetection.createDetector(
    handsModel,
    handsDetectorConfig
  );
  const detectHands = async (net) => {
    const estimationConfig = { flipHorizontal: true };
    const hands = await net.estimateHands(video, estimationConfig);
    requestAnimationFrame(() => {
      if (hands && hands[0] && hands[0].keypoints) {
        setPoints(hands[0].keypoints);
      }
    });
    detectHands(handsDetector);
  };
  detectHands(handsDetector);
};

export const processColor = (color, opacity) => {
  return `${color}${Math.min(255, Math.max(16, opacity))
    .toString(16)
    .padStart(2, "0")}`;
};
