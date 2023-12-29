import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import defaultFacePoints from "../default-face-points.json";

export const runDetector = async (video, setPoints, showsFaces, showsHands) => {
  const facesModel = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const facesDetectorConfig = {
    runtime: "tfjs",
    refineLandmarks: true
  };
  const facesDetector = await faceLandmarksDetection.createDetector(
    facesModel,
    facesDetectorConfig
  );

  const handsModel = handPoseDetection.SupportedModels.MediaPipeHands;
  const handsDetectorConfig = {
    runtime: "tfjs",
    modelType: "full"
  };
  const handsDetector = await handPoseDetection.createDetector(
    handsModel,
    handsDetectorConfig
  );

  const detect = async () => {
    const estimationConfig = { flipHorizontal: true };
    const faces = await facesDetector.estimateFaces(video, estimationConfig);
    const hands = await handsDetector.estimateHands(video, estimationConfig);

    let points = [];
    if (showsFaces && faces && faces[0] && faces[0].keypoints) {
      points = points.concat(faces[0].keypoints);
    }
    if (showsHands && hands && hands[0] && hands[0].keypoints) {
      points = points.concat(hands[0].keypoints);
    }

    setPoints(points);
    requestAnimationFrame(detect);
  };

  detect();
};

export const processColor = (color, opacity) => {
  return `${color}${Math.min(255, Math.max(16, opacity))
    .toString(16)
    .padStart(2, "0")}`;
};

export const renderPath = (area, facePoints = defaultFacePoints) =>
  area.map((activeAreaPoint, activeAreaPointIndex) => {
    const point = facePoints[activeAreaPoint] || { x: 0, y: 0 };
    return `${activeAreaPointIndex === 0 ? "M" : "L"}${point.x}, ${point.y}`;
  });

export const saveFile = (areas) => {
  const data = JSON.stringify(areas);
  const blob = new Blob([data], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'areas.json';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};
