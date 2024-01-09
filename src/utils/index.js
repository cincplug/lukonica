import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";

const findClosestFacePointIndex = ({ facePoints, indexTip, threshold }) => {
  return facePoints.reduce(
    (closestFacePoint, currentFacePoint, currentIndex) => {
      const distance = getDistance(currentFacePoint, indexTip);
      if (distance < closestFacePoint.minDistance && distance < threshold) {
        return { minDistance: distance, index: currentIndex };
      } else {
        return closestFacePoint;
      }
    },
    { minDistance: Infinity, index: null }
  ).index;
};

const getDistance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const runDetector = async ({
  video,
  setup,
  setPoints,
  setChunks,
  setActiveChunk,
  setCursor
}) => {
  let frame = 0;
  const { showsFaces, showsHands } = setup;
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
    if (frame % setup.latency === 0) {
      const estimationConfig = { flipHorizontal: true, staticImageMode: false };
      const faces = await facesDetector.estimateFaces(video, estimationConfig);
      const hands = await handsDetector.estimateHands(video, estimationConfig);

      let points = [];
      if (showsFaces && faces && faces[0] && faces[0].keypoints) {
        faces.forEach((face) => {
          points = points.concat(face.keypoints);
        });
      }
      if (showsHands && hands && hands[0] && hands[0].keypoints) {
        if (!["paths", "curved paths"].includes(setup.pattern)) {
          hands.forEach((hand) => {
            points = points.concat(hand.keypoints);
          });
        }
        const thumbTip = hands[0]?.keypoints[4];
        const indexTip = hands[0]?.keypoints[8];
        const thumbIndexDistance = getDistance(thumbTip, indexTip);
        const threshold = 50;
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

export const processColor = (color, opacity) => {
  return `${color}${Math.min(255, Math.max(16, opacity))
    .toString(16)
    .padStart(2, "0")}`;
};

export const renderPath = ({ area, points, radius }) =>
  area
    .map((activeAreaPoint, activeAreaPointIndex) => {
      const thisPoint = points[activeAreaPoint];
      if (!thisPoint) return null;
      const lastPoint = points[area[activeAreaPointIndex - 1]];
      if (radius > 0 && lastPoint) {
        const deltaX = thisPoint.x - lastPoint.x;
        const deltaY = thisPoint.y - lastPoint.y;
        const controlPointX =
          lastPoint.x +
          deltaX / 2 +
          (radius * deltaY) / Math.hypot(deltaX, deltaY);
        const controlPointY =
          lastPoint.y +
          deltaY / 2 -
          (radius * deltaX) / Math.hypot(deltaX, deltaY);
        return `Q${controlPointX},${controlPointY} ${thisPoint.x},${thisPoint.y}`;
      } else {
        return `${activeAreaPointIndex === 0 ? "M" : "L"} ${thisPoint.x},${
          thisPoint.y
        }`;
      }
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
