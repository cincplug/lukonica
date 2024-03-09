import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@tensorflow/tfjs-backend-webgl";
import DEFAULT_SETUP from "../_setup.json";
import { runDetector } from "../utils/runDetector";
import Webcam from "react-webcam";
import Menu from "./nav/Menu";
import MaskEditor from "./nav/MaskEditor";
import Splash from "./nav/Splash";
import Drawing from "./Drawing";
import Cursor from "./Cursor";
import "../styles.scss";

const targetResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};

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
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
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
  const canvasRef = useRef(null);

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
      const ctx = canvasRef.current?.getContext("2d");
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
        activeMask,
        ctx: ctx || null
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
    const pointsPerHand = 21;
    const handsPointsTotal = handsCount * pointsPerHand;
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
  
  const menu = (
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
  );

  return (
    <div
      className={`wrap wrap--main wrap--${
        isStarted && isLoaded ? "started" : "not-started"
      }`}
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
              position: "absolute"
            }}
            videoConstraints={inputResolution}
            forceScreenshotSourceSize={true}
            onLoadedData={handleVideoLoad}
            mirrored={true}
            imageSmoothing={false}
          />
          {setup.pattern === "canvas" ? (
            <canvas
              className="wrap"
              ref={canvasRef}
              width={width}
              height={height}
            ></canvas>
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
          )}
          <button
            className="splash-button video-button pause-button"
            onClick={handlePlayButtonClick}
          >
            Stop camera
          </button>
          <Cursor
            cursor={cursor}
            hasCursor={setup.hasCursor}
            hasCursorFingertips={setup.hasCursorFingertips}
          />
        </>
      ) : (
        <Splash {...{ setIsEditing, handlePlayButtonClick }} />
      )}
      <Router>
        <Routes>
          <Route path="/:scenario" element={menu} />
          <Route path="/*" element={menu} />
        </Routes>
      </Router>
      {isEditing ? (
        <MaskEditor {...{ inputResolution, setIsEditing, activeMask }} />
      ) : null}
      {/* <pre>{JSON.stringify(scribbleNewArea, null, 4)}</pre> */}
    </div>
  );
};

export default App;
