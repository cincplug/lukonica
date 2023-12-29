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
  if (storedSetup && storedSetup.tasje) {
    initialSetup.tasje = new DOMParser().parseFromString(
      storedSetup.tasje,
      "text/html"
    ).body.firstChild;
  }
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
    const { showsFaces, showsHands } = setup;
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (isLoaded) return;
    runDetector(video, setPoints, showsFaces, showsHands);
    setIsLoaded(true);
  };

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
          {/* <pre>{JSON.stringify(points, null, 4)}</pre> */}
          {/* {points.slice(0,10).length && ( */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${inputResolution.width} ${inputResolution.height}`}
            style={{ position: "absolute", mixBlendMode: setup.blendMode }}
          >
            {points
              .slice(0, -setup.transitionArrangement - 1)
              .map((point, index) => (
                <>
                  {setup.hasCircles && (
                    <circle
                      key={`c-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r={Math.max(0, point.z + setup.radius) * setup.growth}
                      stroke="none"
                      fill={processColor(setup.color, setup.opacity)}
                    >
                      {setup.hasTransition && (
                        <>
                          <animate
                            attributeName="cx"
                            values={`${points[index].x};${
                              points[index + setup.transitionArrangement].x
                            }`}
                            keyTimes="0;1"
                            dur={`${setup.transitionDuration}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="cy"
                            values={`${points[index].y};${
                              points[index + setup.transitionArrangement].y
                            }`}
                            keyTimes="0;1"
                            dur={`${setup.transitionDuration}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="r"
                            values={`${
                              Math.max(0, point.z + setup.radius) * setup.growth
                            };${
                              Math.max(
                                0,
                                points[index + setup.transitionArrangement].z +
                                  setup.radius
                              ) * setup.growth
                            }`}
                            keyTimes="0;1"
                            dur={`${setup.transitionDuration}s`}
                            repeatCount="indefinite"
                          />
                        </>
                      )}
                    </circle>
                  )}
                  {setup.hasLines && (
                    <line
                      key={`l-${index}`}
                      x1={point.x}
                      x2={points[index + setup.transitionArrangement].x}
                      y1={point.y}
                      y2={points[index + setup.transitionArrangement].y}
                      stroke={processColor(setup.color, setup.opacity)}
                      strokeWidth={setup.radius + point.z * setup.growth}
                    >
                      {setup.hasTransition && (
                        <>
                          <animate
                            attributeName="x1"
                            values={`${points[index].x};${
                              points[index + setup.transitionArrangement].x
                            }`}
                            keyTimes="0;1"
                            dur={`${setup.transitionDuration}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="y1"
                            values={`${points[index].y};${
                              points[index + setup.transitionArrangement].y
                            }`}
                            keyTimes="0;1"
                            dur={`${setup.transitionDuration}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="x2"
                            values={`${
                              points[index + setup.transitionArrangement].x
                            };${points[index].x}`}
                            keyTimes="0;1"
                            dur={`${setup.transitionDuration}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="y2"
                            values={`${
                              points[index + setup.transitionArrangement].y
                            };${points[index].y}`}
                            keyTimes="0;1"
                            dur={`${setup.transitionDuration}s`}
                            repeatCount="indefinite"
                          />
                        </>
                      )}
                    </line>
                  )}
                  {setup.hasNumbers && (
                    <text
                      key={`t-${index}`}
                      x={point.x}
                      y={point.y}
                      fill={processColor(setup.color, setup.opacity)}
                    >
                      {index}
                    </text>
                  )}
                </>
              ))}
            {setup.hasMask &&
              mask.map((area, areaIndex) => (
                <path
                  className="mask-path"
                  key={`m-${areaIndex}`}
                  fill={processColor(setup.color, setup.opacity)}
                  d={`${renderPath(area, points)}`}
                  stroke="none"
                >
                  {setup.hasTransition && (
                    <animate
                      attributeName="d"
                      values={`${renderPath(area, points)} Z;${renderPath(
                        area,
                        points
                      )} Z`}
                      keyTimes="0;1"
                      dur={`${setup.transitionDuration}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </path>
              ))}
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
