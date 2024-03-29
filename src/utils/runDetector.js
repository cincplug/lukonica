import { processFaces } from "./processFaces";
import { processHands } from "./processHands";
import { getBall } from "../components/Ball";

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setCustomMask,
  setCustomMaskNewArea,
  setBall,
  setCursor,
  setHandsCount,
  setScribbleNewArea,
  ctx
}) => {
  let shouldContinue = true;

  let facesDetector = null;
  let handsDetector = null;

  if (setupRef.current.showsFaces) {
    const faceLandmarksDetectionModule = await import(
      "@tensorflow-models/face-landmarks-detection"
    );
    const facesModel =
      faceLandmarksDetectionModule.SupportedModels.MediaPipeFaceMesh;
    const facesDetectorConfig = {
      runtime: "tfjs",
      refineLandmarks: false
    };
    facesDetector = await faceLandmarksDetectionModule.createDetector(
      facesModel,
      facesDetectorConfig
    );
  }

  if (setupRef.current.showsHands) {
    const handPoseDetectionModule = await import(
      "@tensorflow-models/hand-pose-detection"
    );
    const handsModel = handPoseDetectionModule.SupportedModels.MediaPipeHands;
    const handsDetectorConfig = {
      runtime: "tfjs",
      modelType: "lite"
    };
    handsDetector = await handPoseDetectionModule.createDetector(
      handsModel,
      handsDetectorConfig
    );
  }

  let lastTime = 0;
  const frameRate = 30;
  const targetFrameTime = 1000 / frameRate;
  let animationFrameId;

  const detect = async (timeStamp = 0) => {
    if (timeStamp - lastTime < targetFrameTime) {
      animationFrameId = requestAnimationFrame(detect);
      return;
    }
    lastTime = timeStamp;

    const { showsFaces, showsHands } = setupRef.current;
    const estimationConfig = { flipHorizontal: true, staticImageMode: false };
    let faces = null;
    let hands = null;
    try {
      if (showsFaces && facesDetector) {
        faces = await facesDetector.estimateFaces(video, estimationConfig);
      }
      if (showsHands && handsDetector) {
        hands = await handsDetector.estimateHands(video, estimationConfig);
      }
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
      points = [...points, ...facePoints];
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
      points = [...points, ...handPoints];
    }
    setHandsCount(hands ? hands.length : 0);
    if (points.length) {
      setPoints(points);
    }
    if (shouldContinue) {
      animationFrameId = requestAnimationFrame(detect);
    }
    setBall((prevState) => getBall(prevState));
  };
  animationFrameId = requestAnimationFrame(detect);

  return () => {
    shouldContinue = false;
    cancelAnimationFrame(animationFrameId);
  };
};
