import React, { useEffect, useState, useRef } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import "@mediapipe/hands";
import Webcam from "react-webcam";
import { runDetector } from "../utils/runDetector";
import defaultSetup from "../_setup.json";
import Menu from "./Menu";
import Splash from "./Splash";
import FaceEditor from "./FaceEditor";
import Images from "./patterns/Images";
import Paths from "./patterns/Paths";
import Numbers from "./patterns/Numbers";
import "../styles.scss";

const inputResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
const { width, height } = inputResolution;
const handsPointsCount = 42;

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [activeChunk, setActiveChunk] = useState([]);
  const [activeMask, setActiveMask] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0, isActive: false });

  const storageSetupItem = "lukonicaSetup";
  const storedSetupRaw = sessionStorage.getItem(storageSetupItem);
  const storedSetup = storedSetupRaw ? JSON.parse(storedSetupRaw) : null;
  const initialSetup = {};
  defaultSetup.forEach((item) => {
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

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (isLoaded) return;
    runDetector({
      setupRef,
      video,
      setPoints,
      setChunks,
      setActiveChunk,
      setCursor
    });
    setIsLoaded(true);
  };

  let flatMask = activeMask.flat();
  const flatMaskLength = flatMask.length;
  if (flatMaskLength > 0) {
    flatMask = flatMask.slice(0, -setup.transitionArrangement - 1);
  }
  if (setup.showsHands && points && points.length > 0) {
    flatMask = flatMask.concat(
      ...Array.from(
        { length: handsPointsCount },
        (_, i) => i + points.length - handsPointsCount + 1
      )
    );
  }

  useEffect(() => {
    if (!cursor.isActive && activeChunk.length > 0) {
      setCursor((prevCursor) => {
        setActiveChunk((prevActiveChunk) => {
          setChunks((prevChunks) => {
            return [...prevChunks, prevActiveChunk];
          });
          return [];
        });
        return { ...prevCursor, isActive: false };
      });
    }
  }, [cursor.isActive, activeChunk.length]);

  return (
    <div className="wrap">
      {isStarted ? (
        <>
          <Webcam
            width={inputResolution.width}
            height={inputResolution.height}
            style={{
              visibility: setup.showsVideo ? "visible" : "hidden",
              position: "absolute"
            }}
            videoConstraints={inputResolution}
            onLoadedData={handleVideoLoad}
            mirrored={true}
            imageSmoothing={false}
          />
          {points && points.length > 0 && (
            <svg
              className="drawing"
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${width} ${height}`}
              style={{ mixBlendMode: setup.blendMode, width, height }}
            >
              {(() => {
                switch (setup.pattern) {
                  case "images":
                    return (
                      <Images
                        {...{
                          points,
                          flatMask,
                          setup,
                          cursor
                        }}
                      />
                    );
                  case "paths":
                    return (
                      <Paths
                        {...{
                          points,
                          activeMask,
                          setup,
                          chunks,
                          activeChunk,
                          cursor
                        }}
                      />
                    );
                  case "numbers":
                    return (
                      <Numbers
                        {...{
                          points,
                          setup,
                          cursor
                        }}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </svg>
          )}
          <Menu
            {...{
              setup,
              handleInputChange,
              setSetup,
              setActiveMask,
              activeMask: activeMask.concat(chunks)
            }}
          />
        </>
      ) : (
        <>
          <Splash {...{ setIsStarted, setSetup, setIsEditing }} />
          {isEditing ? (
            <FaceEditor {...{ inputResolution, setIsEditing }} />
          ) : null}
        </>
      )}
      {/* <pre>{JSON.stringify(points, null, 4)}</pre> */}
    </div>
  );
}

export default App;
