import React, { useState } from "react";
import "@tensorflow/tfjs";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import "@mediapipe/hands";
import Webcam from "react-webcam";
import { runDetector, processColor, renderPath } from "./utils";
import defaultSetup from "./_setup.json";
import Menu from "./Menu";
import Splash from "./Splash";
import FaceEditor from "./FaceEditor";
import mask from "./masks/luka.json";
import "./App.scss";

const inputResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
  facingMode: "user"
};
const handsPointsCount = 21;

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState([]);

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
    runDetector({ video, setPoints, setup });
    setIsLoaded(true);
  };

  // const activePoints = points.filter((_point, pointIndex) => mask.flat().includes(pointIndex));
  let flatMask = mask.flat().slice(0, -setup.transitionArrangement - 1);
  if (setup.showsHands && points.length > 478) {
    flatMask = flatMask.concat(
      ...Array.from(
        { length: handsPointsCount },
        (_, i) => i + points.length - handsPointsCount - 1
      )
    );
  }
  const { radius, pattern } = setup;

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
            videoConstraints={videoConstraints}
            onLoadedData={handleVideoLoad}
            mirrored={true}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${inputResolution.width} ${inputResolution.height}`}
            style={{ position: "absolute", mixBlendMode: setup.blendMode }}
          >
            {points.length > 0
              ? flatMask.map(
                  (flatMaskPoint, index) =>
                    pattern === "circles" && (
                      <circle
                        key={`c-${index}`}
                        cx={points[flatMaskPoint].x}
                        cy={points[flatMaskPoint].y}
                        r={
                          Math.max(
                            0,
                            (points[flatMaskPoint].z || index - flatMask.length + handsPointsCount) +
                              setup.radius
                          ) * setup.growth
                        }
                        stroke="none"
                        fill={processColor(setup.color, setup.opacity)}
                      >
                        {setup.hasTransition && (
                          <>
                            <animate
                              attributeName="cx"
                              values={`${points[flatMaskPoint].x};${
                                points[
                                  flatMaskPoint + setup.transitionArrangement
                                ].x
                              }`}
                              keyTimes="0;1"
                              dur={`${setup.transitionDuration}s`}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="cy"
                              values={`${points[flatMaskPoint].y};${
                                points[
                                  flatMaskPoint + setup.transitionArrangement
                                ].y
                              }`}
                              keyTimes="0;1"
                              dur={`${setup.transitionDuration}s`}
                              repeatCount="indefinite"
                            />
                          </>
                        )}
                      </circle>
                    )
                )
              : null}
            {pattern === "paths" || pattern === "curved paths"
              ? mask.map((area, areaIndex) => (
                  <path
                    className="mask-path"
                    key={`m-${areaIndex}`}
                    fill={processColor(setup.color, setup.opacity)}
                    d={`${renderPath({
                      area,
                      points,
                      radius: pattern === "curved paths" ? radius : 0
                    })}`}
                    stroke="none"
                  ></path>
                ))
              : null}
          </svg>
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
