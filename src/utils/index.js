// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";

export const runDetector = async (video, setPoints) => {
  // const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  // const detectorConfig = {
  //   runtime: "tfjs",
  //   refineLandmarks: true
  // };
  // const detector = await faceLandmarksDetection.createDetector(
  //   model,
  //   detectorConfig
  // );
  // const detect = async (net) => {
  //   const estimationConfig = { flipHorizontal: true };
  //   const faces = await net.estimateFaces(video, estimationConfig);
  //   requestAnimationFrame(() => {
  //     if (faces && faces[0] && faces[0].keypoints) {
  //       setPoints(faces[0].keypoints);
  //     }
  //   });
  //   detect(detector);
  // };
  // detect(detector);
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: "tfjs", // or 'tfjs',
    modelType: "full"
  };
  const detector = await handPoseDetection.createDetector(
    model,
    detectorConfig
  );
  const detect = async (net) => {
    const estimationConfig = { flipHorizontal: true };
    const hands = await net.estimateHands(video, estimationConfig);
    requestAnimationFrame(() => {
      if (hands && hands[0] && hands[0].keypoints) {
        setPoints(hands[0].keypoints);
      }
    });
    detect(detector);
  };
  detect(detector);
};

export const processColor = (color, opacity) => {
  return `${color}${Math.min(255, Math.max(16, opacity))
    .toString(16)
    .padStart(2, "0")}`;
};
