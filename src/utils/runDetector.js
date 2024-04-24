import { processFaces } from "./processFaces";
import { getBall } from "../components/Ball";

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setBall,
  setCursor,
  setMessage
}) => {
  let shouldContinue = true;

  let facesDetector = null;

  const faceLandmarksDetectionModule = await import(
    "@tensorflow-models/face-landmarks-detection"
  );
  const facesModel =
    faceLandmarksDetectionModule.SupportedModels.MediaPipeFaceMesh;
  // const facesDetectorConfig = {
  //   runtime: "tfjs",
  //   refineLandmarks: false
  // };
  const facesDetectorConfig = {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    refineLandmarks: false
  };
  try {
    facesDetector = await faceLandmarksDetectionModule.createDetector(
      facesModel,
      facesDetectorConfig
    );
  } catch (error) {
    console.error("Error creating detector", error);
    setMessage(
      "Something's wrong with fetching data. It's not us, it's them 🥸"
    );
    return;
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

    const estimationConfig = { flipHorizontal: true, staticImageMode: false };
    let faces = null;
    try {
      faces = await facesDetector.estimateFaces(video, estimationConfig);
    } catch (error) {
      setMessage("I don't see well, is it too dark? 🥸");
      console.error("Error estimating faces", error);
      return;
    }

    let points = [];

    if (faces?.length) {
      const facePoints = processFaces({
        faces,
        setCursor
      });
      points = [...points, ...facePoints];
    }

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
