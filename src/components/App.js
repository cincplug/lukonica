import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@tensorflow/tfjs-backend-webgl";
import { runDetector } from "../utils/runDetector";
import { getStoredSetup, storeSetup } from "../utils/storeSetup";
import Webcam from "react-webcam";
import Menu from "./nav/Menu";
import MaskEditor from "./nav/MaskEditor";
import Splash from "./nav/Splash";
import Message from "./nav/Message";
import Drawing from "./Drawing";
import "../styles.scss";

const targetResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
const initialSetup = getStoredSetup();

const App = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState([]);
  const [customMask, setCustomMask] = useState([]);
  const [customMaskNewArea, setCustomMaskNewArea] = useState([]);
  const [activeMask, setActiveMask] = useState([]);
  const [setup, setSetup] = useState(initialSetup);
  const [ball, setBall] = useState({
    x: targetResolution.width / 2,
    y: targetResolution.height / 2,
    angle: 45
  });
  const [message, setMessage] = useState("");

  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        setSetup((prevSetup) => {
          return { ...prevSetup, isSpacePressed: true };
        });
      }
    };
    const handleKeyUp = (event) => {
      if (event.key === " ") {
        setSetup((prevSetup) => {
          return { ...prevSetup, isSpacePressed: false };
        });
      }
      if (event.key === "Backspace") {
        clearPaths();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const clearPaths = () => {
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
      storeSetup(nextSetup);
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
      if (inputResolution.width >= 768) {
        setInputResolution({ width: videoWidth, height: videoHeight });
      }
      runDetector({
        setupRef,
        video,
        setPoints,
        setCustomMask,
        setCustomMaskNewArea,
        activeMask,
        setBall,
        setMessage
      }).then((stopDetectorCallback) => {
        setStopDetector(() => stopDetectorCallback);
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
          ...prevSetup
        };
      });
      return !prevIsStarted;
    });
  };

  let flatMask = activeMask.flat();
  if (flatMask.length && setup.arrangement) {
    flatMask = flatMask.slice(0, -setup.arrangement - 1);
  }

  const menu = (
    <Menu
      {...{
        setup,
        handleInputChange,
        setSetup,
        setActiveMask,
        setPoints,
        clearPaths,
        activeMask: activeMask.concat(customMask),
        setIsEditing
      }}
    />
  );

  return (
    <div
      className={`wrap wrap--main wrap--${
        isStarted && isLoaded ? "started" : "not-started"
      } theme theme-${setup.theme}`}
      style={{ width, height }}
    >
      {isStarted ? (
        <>
          <svg
            className="bg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} ${height}`}
            style={{ width, height }}
          >
            <rect width={width} height={height} fill={setup.bg}></rect>
          </svg>
          <Webcam
            audio={false}
            ref={webcamRef}
            width={width}
            height={height}
            style={{
              opacity: setup.videoOpacity / 255,
              position: "absolute",
              transform: `scale(${setup.zoom}, ${setup.zoom})`
            }}
            videoConstraints={inputResolution}
            forceScreenshotSourceSize={true}
            onLoadedData={handleVideoLoad}
            mirrored={true}
            imageSmoothing={false}
          />
          {setup.pattern !== "canvas" && (
            <Drawing
              {...{
                inputResolution,
                setup,
                points,
                flatMask,
                customMask,
                customMaskNewArea,
                activeMask,
                ball
              }}
            />
          )}
          <button
            className="splash-button video-button pause-button"
            onClick={handlePlayButtonClick}
          >
            Stop camera
          </button>
        </>
      ) : (
        <Splash {...{ setIsEditing, handlePlayButtonClick }} />
      )}
      {message && <Message {...{ message, setMessage }} />}
      <Router>
        <Routes>
          <Route path="/:scenario" element={menu} />
          <Route path="/*" element={menu} />
        </Routes>
      </Router>
      {isEditing ? (
        <MaskEditor {...{ inputResolution, setIsEditing, activeMask }} />
      ) : null}
    </div>
  );
};

export default App;
