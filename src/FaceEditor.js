import React, { useState } from "react";
import defaultFacePoints from "./default-face-points.json";
import { renderPath } from "./utils";
import "./App.scss";

function FaceEditor(props) {
  const { inputResolution } = props;
  const [areas, setAreas] = useState([]);
  const [activeArea, setActiveArea] = useState([]);
  const handleDotClick = (_event, pointIndex) => {
    if (activeArea.length === 0) {
      setActiveArea([pointIndex]);
    } else {
      if (activeArea[0] === pointIndex) {
        setAreas((prevAreas) => {
          console.info([...prevAreas, activeArea]);
          return [...prevAreas, activeArea];
        });
        setActiveArea([]);
      } else {
        setActiveArea((prevActiveArea) => {
          return [...prevActiveArea, pointIndex];
        });
      }
    }
  };
  return (
    <div className="face-editor">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${inputResolution.width} ${inputResolution.height}`}
      >
        {defaultFacePoints.map((point, pointIndex) => {
          return (
            <circle
              key={`c-${pointIndex}`}
              cx={point.x}
              cy={point.y}
              r={2}
              className={`face-editor__dot ${
                activeArea[0] === pointIndex ? "face-editor__dot--first" : ""
              }`}
              onClick={(event) => handleDotClick(event, pointIndex)}
            />
          );
        })}
        {activeArea.length > 0 ? (
          <path
            className="face-editor__active-area"
            d={renderPath(activeArea)}
          />
        ) : null}

        {areas.map((area, areaIndex) => (
          <path
            key={`a-${areaIndex}`}
            className="area"
            d={`${renderPath(area)} Z`}
          />
        ))}
      </svg>
      <button onClick={() => {}}>Both</button>
    </div>
  );
}

export default FaceEditor;
