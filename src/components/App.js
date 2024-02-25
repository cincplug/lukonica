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
import Cursor from "./Cursor";
import "../styles.scss";

const targetResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
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

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === "Backspace") {
        clearPaths();
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (cursor.isWagging && setup.pattern !== "canvas") {
      clearPaths();
    }
  }, [cursor.isWagging, setup.pattern]);

  const clearPaths = () => {
    setScribble([]);
    setScribbleNewArea([]);
    setPoints([]);
    setCustomMask([]);
    setCustomMaskNewArea([]);
  };

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
      if (id === "hasCursor") {
        console.info(nextSetup);
      }
      return nextSetup;
    });
  };

  const webcamRef = useRef(null);
  const [stopDetector, setStopDetector] = useState(null);
  const [shouldRunDetector, setShouldRunDetector] = useState(false);
  const [inputResolution, setInputResolution] = useState(targetResolution);
  const { width, height } = inputResolution;

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (isLoaded) return;
    if (shouldRunDetector) {
      const { videoWidth, videoHeight } = video;
      setInputResolution({ width: videoWidth, height: videoHeight });
      runDetector({
        setupRef,
        video,
        setPoints,
        setCustomMask,
        setCustomMaskNewArea,
        setCursor,
        setHandsCount,
        setScribble,
        setScribbleNewArea,
        activeMask
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
  if (flatMask.length && setup.transitionArrangement) {
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
      className={`wrap wrap--main wrap--${
        isStarted && isLoaded ? "started" : "not-started"
      }`}
      style={{ width, height }}
    >
      {isStarted && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            width={width}
            height={height}
            style={{
              opacity: setup.videoOpacity / 255,
              position: "absolute"
            }}
            videoConstraints={inputResolution}
            forceScreenshotSourceSize={true}
            onLoadedData={handleVideoLoad}
            mirrored={true}
            imageSmoothing={false}
          />
          {isLoaded &&
            (setup.pattern === "canvas" ? (
              <div className="wrap">
                <canvas id="canvas" width={width} height={height}></canvas>
                <Cursor
                  cursor={cursor}
                  hasCursorFingertips={setup.hasCursorFingertips}
                />
              </div>
            ) : (
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
            ))}
          <button
            className="splash-button video-button pause-button"
            onClick={handlePlayButtonClick}
          >
            Stop camera
          </button>
        </>
      )}
      {!isStarted && <Splash {...{ setIsEditing, handlePlayButtonClick }} />}
      <Menu
        {...{
          setup,
          handleInputChange,
          setSetup,
          setActiveMask,
          setPoints,
          clearPaths,
          activeMask: activeMask.concat(customMask)
        }}
      />
      {isEditing ? (
        <MaskEditor {...{ inputResolution, setIsEditing, activeMask }} />
      ) : null}
      {/* <pre>{JSON.stringify(scribbleNewArea, null, 4)}</pre> */}
    </div>
  );
};

export default App;
