import React, { useState } from "react";
import "@tensorflow/tfjs";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector, processColor } from "./utils";
import defaultSetup from "./_setup.json";
import Menu from "./Menu";
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
  const [loaded, setLoaded] = useState(false);
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
      console.info(nextSetup, id, value);
      sessionStorage.setItem(storageSetupItem, JSON.stringify(nextSetup));
      return nextSetup;
    });
  };

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    runDetector(video, setPoints);
    // if (detectedPoints) setPoints(detectedPoints);
    setLoaded(true);
  };
  return (
    <div className="wrap">
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
        {points.slice(0, -setup.transitionArrangement - 1).map((point, index) => (
          <circle
            key={index}
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
                    Math.max(0, points[index + setup.transitionArrangement].z + setup.radius) *
                    setup.growth
                  }`}
                  keyTimes="0;1"
                  dur={`${setup.transitionDuration}s`}
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
        ))}
        {/* {points.slice(0, -4).map((point, index) => (
          <line
            x1={point.x}
            x2={points[index + setup.transitionArrangement].x}
            y1={point.y}
            y2={points[index + setup.transitionArrangement].y}
            stroke="black"
            fill="#00000020"
          >
            <animate
              attributeName="x1"
              values={`${points[index].x};${points[index + setup.transitionArrangement].x}`}
              keyTimes="0;1"
              dur={`${setup.transitionDuration}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y1"
              values={`${points[index].y};${points[index + setup.transitionArrangement].y}`}
              keyTimes="0;1"
              dur={`${setup.transitionDuration}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values={`${points[index + 2].x};${points[index + 3].x}`}
              keyTimes="0;1"
              dur={`${setup.transitionDuration}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values={`${points[index + 2].y};${points[index + 3].y}`}
              keyTimes="0;1"
              dur={`${setup.transitionDuration}s`}
              repeatCount="indefinite"
            />
          </line>
        ))} */}
      </svg>
      <Menu
        {...{
          setup,
          handleInputChange,
          setSetup
        }}
      />
      {loaded ? <></> : <header>Loading...</header>}
    </div>
  );
}

export default App;
