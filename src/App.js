import React, { useState } from "react";
import "@tensorflow/tfjs";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import "@mediapipe/hands";
import Webcam from "react-webcam";
import { runDetector } from "./utils";
import defaultSetup from "./_setup.json";
import Menu from "./Menu";
import Splash from "./Splash";
import FaceEditor from "./FaceEditor";
import Circles from "./Circles";
import Images from "./Images";
import Paths from "./Paths";
import Frank from "./Frank";
import mask from "./masks/outer.json";
import "./App.scss";

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

  const storageSetupItem = "kwastjeSetup";
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
      return nextSetup;
    });
  };

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (isLoaded) return;
    runDetector({
      video,
      setPoints,
      setChunks,
      activeChunk,
      setActiveChunk,
      setup
    });
    setIsLoaded(true);
  };

  // const activePoints = points.filter((_point, pointIndex) => mask.flat().includes(pointIndex));
  let flatMask = mask.flat().slice(0, -setup.transitionArrangement - 1);
  if (setup.showsHands && points && points.length > 0) {
    flatMask = flatMask.concat(
      ...Array.from(
        { length: handsPointsCount },
        (_, i) => i + points.length - handsPointsCount + 1
      )
    );
  }

  return (
    <div className="wrap">
      {isStarted ? (
        <>
          <Webcam
            width={inputResolution.width}
            height={inputResolution.height}
            style={{
              visibility: setup.hasVideo ? "visible" : "hidden",
              position: "absolute"
            }}
            videoConstraints={inputResolution}
            onLoadedData={handleVideoLoad}
            mirrored={true}
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
                  case "circles":
                    return (
                      <Circles
                        {...{ points, flatMask, setup, handsPointsCount }}
                      />
                    );
                  case "images":
                    return (
                      <Images
                        {...{ points, flatMask, setup, handsPointsCount }}
                      />
                    );
                  case "paths":
                  case "curved paths":
                    return <Paths {...{ points, mask, setup }} />;
                  case "frank":
                    return (
                      <Frank
                        {...{ points, chunks, activeChunk, mask, setup }}
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
    </div>
  );
}

export default App;
