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
import MaskEditor from "./MaskEditor";
import Splash from "./Splash";
import "../styles.scss";

const inputResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
const { width, height } = inputResolution;
const DEFAULT_HAND_POINTS_COUNT = 21;

const App = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState([]);
  const [customMask, setCustomMask] = useState([]);
  const [customMaskNewArea, setCustomMaskNewArea] = useState([]);
  const [activeMask, setActiveMask] = useState([]);
  const [scribble, setScribble] = useState([]);
  const [scribbleNewArea, setScribbleNewArea] = useState([]);
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
        setCustomMask,
        setCustomMaskNewArea,
        setCursor,
        setHandsCount,
        setScribble,
        setScribbleNewArea
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
    if (
      !cursor.isPinched &&
      (customMaskNewArea.length > 0 || scribbleNewArea.length > 0)
    ) {
      if (customMaskNewArea.length > 0) {
        setCustomMaskNewArea((prevCustomMaskNewArea) => {
          setCustomMask((prevCustomMask) => {
            return [...prevCustomMask, prevCustomMaskNewArea];
          });
          return [];
        });
      }
      if (scribbleNewArea.length > 0) {
        setScribbleNewArea((prevScribbleNewArea) => {
          setScribble((prevScribble) => {
            return [...prevScribble, prevScribbleNewArea];
          });
          return [];
        });
      }
    }
  }, [cursor.isPinched, customMaskNewArea.length, scribbleNewArea.length]);

  return (
    <div
      className={`wrap wrap--${
        isStarted && isLoaded ? "started" : "not-started"
      }`}
    >
      {isStarted && (
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
              customMask,
              customMaskNewArea,
              activeMask,
              scribble,
              scribbleNewArea
            }}
          />
          <button
            className="splash-button video-button pause-button"
            onClick={handlePlayButtonClick}
          >
            Stop video
          </button>
        </>
      )}
      <Menu
        {...{
          setup,
          handleInputChange,
          setSetup,
          setActiveMask,
          setPoints,
          setCustomMask,
          setCustomMaskNewArea,
          setScribble,
          setScribbleNewArea,
          activeMask: activeMask.concat(customMask)
        }}
      />
      {isEditing ? <MaskEditor {...{ inputResolution, setIsEditing }} /> : null}
      {!isStarted && <Splash {...{ setIsEditing, handlePlayButtonClick }} />}
      {/* <pre>{JSON.stringify(scribbleNewArea, null, 4)}</pre> */}
    </div>
  );
};

export default App;
