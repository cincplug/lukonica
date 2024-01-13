import React, { useEffect, useState } from "react";
import "@tensorflow/tfjs";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import "@mediapipe/hands";
import Webcam from "react-webcam";
import { runDetector } from "../utils";
import defaultSetup from "../_setup.json";
import Menu from "./Menu";
import Splash from "./Splash";
import FaceEditor from "./FaceEditor";
import Images from "./patterns/Images";
import Paths from "./patterns/Paths";
import mask from "../masks/luka.json";
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
  const [cursor, setCursor] = useState({ x: 0, y: 0, isActive: false });

  const storageSetupItem = "lukonicaSetup";
  const storedSetupRaw = sessionStorage.getItem(storageSetupItem);
  const storedSetup = storedSetupRaw ? JSON.parse(storedSetupRaw) : null;
  const initialSetup = {};
  defaultSetup.forEach((item) => {
    initialSetup[item.id] = storedSetup ? storedSetup[item.id] : item.value;
  });
  const [setup, setSetup] = useState(initialSetup);
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
      if(["latency", "pattern", "gripThreshold"].includes(id)) {
        window.location.reload();
      }
      return nextSetup;
    });
  };

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (isLoaded) return;
    runDetector({
      video,
      setup,
      setPoints,
      setChunks,
      setActiveChunk,
      setCursor
    });
    setIsLoaded(true);
  };

  // const activePoints = points.filter((_point, pointIndex) => mask.flat().includes(pointIndex));
  let flatMask = mask.flat();
  const flatMaskLength = flatMask.length;
  flatMask = flatMask.slice(0, -setup.transitionArrangement - 1);
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
                          handsPointsCount,
                          cursor,
                          flatMaskLength
                        }}
                      />
                    );
                  case "paths":
                  case "curved paths":
                    return (
                      <Paths
                        {...{ points, chunks, activeChunk, mask, setup }}
                      />
                    );
                  default:
                    return null;
                }
              })()}
              <circle
                className={`cursor cursor--${
                  cursor.isActive ? "active" : "inactive"
                }`}
                r={6}
                cx={cursor.x}
                cy={cursor.y}
              ></circle>
            </svg>
          )}
          <Menu
            {...{
              setup,
              handleInputChange,
              setSetup
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
