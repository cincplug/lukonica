import React, { useEffect, useState, useRef } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import "@mediapipe/hands";
import DEFAULT_SETUP from "../_setup.json";
import { runDetector } from "../utils/runDetector";
import Webcam from "react-webcam";
import Drawing from "./Drawing";
import Menu from "./Menu";
import FaceEditor from "./FaceEditor";
import "../styles.scss";

const inputResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
const { width, height } = inputResolution;
const DEFAULT_HAND_POINTS_COUNT = 21;

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [activeChunk, setActiveChunk] = useState([]);
  const [activeMask, setActiveMask] = useState([]);
  const [scribble, setScribble] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0, isPinched: false });
  const [handsCount, setHandsCount] = useState(0);

  const storageSetupItem = "lukonicaSetup";
  const storedSetupRaw = sessionStorage.getItem(storageSetupItem);
  const storedSetup = storedSetupRaw ? JSON.parse(storedSetupRaw) : null;
  const initialSetup = {};
  DEFAULT_SETUP.forEach((item) => {
    initialSetup[item.id] = storedSetup ? storedSetup[item.id] : item.value;
  });
  const [setup, setSetup] = useState(initialSetup);

  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  const handleInputChange = (event) => {
    setSetup((prevSetup) => {
      const { id, value, type } = event.target;
      const nextSetup = { ...prevSetup };
      if (type === "checkbox") {
        nextSetup[id] = !nextSetup[id];
      } else {
        nextSetup[id] = ["number", "range"].includes(type) ? value / 1 : value;
      }
      sessionStorage.setItem(storageSetupItem, JSON.stringify(nextSetup));
      return nextSetup;
    });
  };

  const webcamRef = useRef(null);
  const [stopDetector, setStopDetector] = useState(null);
  const [shouldRunDetector, setShouldRunDetector] = useState(false);

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (isLoaded) return;
    if (shouldRunDetector) {
      runDetector({
        setupRef,
        video,
        setPoints,
        setChunks,
        setActiveChunk,
        setCursor,
        setHandsCount,
        setScribble
      }).then((stop) => {
        setStopDetector(() => stop);
      });
    }
    setIsLoaded(true);
  };

  const handlePlayButtonClick = (event) => {
    setIsStarted((prevIsStarted) => {
      setSetup((prevSetup) => {
        if (stopDetector && prevIsStarted) {
          try {
            stopDetector();
          } catch (error) {
            console.error("An error occurred:", error);
          }
          setIsLoaded(false);
        }
        setShouldRunDetector(!prevIsStarted);
        return {
          ...prevSetup,
          showsFaces: prevSetup.showsFaces,
          showsHands: true
        };
      });
      return !prevIsStarted;
    });
  };

  let flatMask = activeMask.flat();
  const flatMaskLength = flatMask.length;
  if (flatMaskLength > 0) {
    flatMask = flatMask.slice(0, -setup.transitionArrangement - 1);
  }
  if (setup.showsHands && points && points.length > 0 && handsCount > 0) {
    const handsPointsTotal = handsCount * DEFAULT_HAND_POINTS_COUNT;
    flatMask = flatMask.concat(
      ...Array.from(
        { length: handsPointsTotal },
        (_, i) => i + points.length - handsPointsTotal
      )
    );
  }

  useEffect(() => {
    if (!cursor.isPinched && activeChunk.length > 0) {
      setCursor((prevCursor) => {
        setActiveChunk((prevActiveChunk) => {
          setChunks((prevChunks) => {
            return [...prevChunks, prevActiveChunk];
          });
          return [];
        });
        return { ...prevCursor, isPinched: false };
      });
    }
  }, [cursor.isPinched, activeChunk.length]);

  return (
    <div
      className={`wrap wrap--${
        isStarted && isLoaded ? "started" : "not-started"
      }`}
    >
      {isStarted ? (
        <>
          <Webcam
            ref={webcamRef}
            width={width}
            height={height}
            style={{
              opacity: setup.videoOpacity / 255,
              position: "absolute"
            }}
            videoConstraints={inputResolution}
            onLoadedData={handleVideoLoad}
            mirrored={true}
            imageSmoothing={false}
          />
          <Drawing
            {...{
              inputResolution,
              setup,
              points,
              flatMask,
              cursor,
              chunks,
              activeChunk,
              activeMask,
              scribble
            }}
          />
        </>
      ) : (
        <>
          <button
            className="splash-button"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit areas
          </button>
        </>
      )}
      <button
        className={`splash-button video-button ${
          isStarted ? "pause-button" : "play-button"
        }`}
        onClick={handlePlayButtonClick}
      >
        {isStarted ? "Stop video" : "Start video"}
      </button>
      {isEditing ? <FaceEditor {...{ inputResolution, setIsEditing }} /> : null}
      <Menu
        {...{
          setup,
          handleInputChange,
          setSetup,
          setActiveMask,
          setPoints,
          setChunks,
          setActiveChunk,
          setScribble,
          activeMask: activeMask.concat(chunks)
        }}
      />
      {/* <pre>{JSON.stringify(points, null, 4)}</pre> */}
    </div>
  );
}

export default App;
