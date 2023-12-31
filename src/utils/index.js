import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import defaultFacePoints from "../default-face-points.json";

export const runDetector = async ({ video, setup, setPoints }) => {
  let frame = 0;
  const { showsFaces, showsHands } = setup;
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
    if (frame % setup.latency === 0) {
      const estimationConfig = { flipHorizontal: true };
      const faces = await facesDetector.estimateFaces(video, estimationConfig);
      const hands = await handsDetector.estimateHands(video, estimationConfig);

      let points = [];
      if (showsFaces && faces && faces[0] && faces[0].keypoints) {
        faces.forEach((face) => {
          points = points.concat(face.keypoints);
        });
      }
      if (showsHands && hands && hands[0] && hands[0].keypoints) {
        hands.forEach((hand) => {
          points = points.concat(hand.keypoints);
        });
      }

      setPoints(points);
    }
    frame++;
    requestAnimationFrame(detect);
  };

  detect();
};

export const processColor = (color, opacity) => {
  return `${color}${Math.min(255, Math.max(16, opacity))
    .toString(16)
    .padStart(2, "0")}`;
};

export const renderPath = ({ area, points = defaultFacePoints, radius }) =>
  area
    .map((activeAreaPoint, activeAreaPointIndex) => {
      const point = points[activeAreaPoint];
      if (!point) return null;
      return `${
        activeAreaPointIndex === 0
          ? "M"
          : radius > 0
          ? `Q${point.x + radius},${point.y + radius} `
          : "L"
      } ${point.x},${point.y}`;
    })
    .join(" ");

export const saveFile = (areas) => {
  const data = JSON.stringify(areas);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "areas.json";
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};
