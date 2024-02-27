import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { processFaces } from "./faceUtils";
import { processHands } from "./handUtils";

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

  let facesDetector = null;

  if (setupRef.current.showsFaces) {
    const faceLandmarksDetection = await import(
      "@tensorflow-models/face-landmarks-detection"
    );
    const facesModel = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const facesDetectorConfig = {
      runtime: "tfjs",
      refineLandmarks: false
    };
    facesDetector = await faceLandmarksDetection.createDetector(
      facesModel,
      facesDetectorConfig
    );
  }

  const handsModel = handPoseDetection.SupportedModels.MediaPipeHands;
  const handsDetectorConfig = {
    runtime: "tfjs",
    modelType: "lite"
  };
  const handsDetector = await handPoseDetection.createDetector(
    handsModel,
    handsDetectorConfig
  );

  const canvasElement = document.getElementById("canvas") || null;
  const ctx = canvasElement?.getContext("2d") || null;

  const detect = async () => {
    const { showsFaces, showsHands, latency } = setupRef.current;
    if (frame % latency === 0) {
      const estimationConfig = { flipHorizontal: true, staticImageMode: false };
      let faces = null;
      let hands;
      try {
        if (showsFaces && facesDetector) {
          faces = await facesDetector.estimateFaces(video, estimationConfig);
        }
        hands = await handsDetector.estimateHands(video, estimationConfig);
      } catch (error) {
        console.error("Error estimating faces or hands", error);
        return;
      }

      let points = [];

      if (showsFaces && faces?.length) {
        const facePoints = processFaces({
          faces,
          setCursor
        });
        points = [...points, ...facePoints]; // Combine old and new points
      }

      if (showsHands && hands?.length) {
        const handPoints = processHands({
          setupRef,
          hands,
          points,
          setCursor,
          setCustomMaskNewArea,
          setCustomMask,
          setScribbleNewArea,
          ctx
        });
        points = [...points, ...handPoints]; // Combine old and new points
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
