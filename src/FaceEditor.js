import React, { useState } from "react";
import defaultFacePoints from "./default-face-points.json";
import { renderPath, saveFile } from "./utils";
import "./App.scss";

function FaceEditor(props) {
  const { inputResolution, setIsEditing } = props;
  const [areas, setAreas] = useState([]);
  const [activeArea, setActiveArea] = useState([]);
  const [mouseX, setMouseX] = useState(inputResolution.width / 2);
  const [mouseY, setMouseY] = useState(inputResolution.height / 2);

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
  const handleMouseMove = (event) => {
    setMouseX(event.pageX || event.touches[0].pageX);
    setMouseY(event.pageY || event.touches[0].pageY);
  };

  return (
    <div className="face-editor" onMouseMove={handleMouseMove}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${inputResolution.width} ${inputResolution.height}`}
      >
        {activeArea.length > 0 ? (
          <path
            className="face-editor__active-area"
            d={`${renderPath(activeArea)} L${mouseX},${mouseY}`}
          />
        ) : null}
        {defaultFacePoints.map((point, pointIndex) => {
          return (
            <circle
              key={`c-${pointIndex}`}
              cx={point.x}
              cy={point.y}
              r={4}
              className={`face-editor__dot ${
                activeArea[0] === pointIndex ? "face-editor__dot--first" : ""
              }`}
              onClick={(event) => handleDotClick(event, pointIndex)}
            />
          );
        })}

        {areas.map((area, areaIndex) => (
          <path
            key={`a-${areaIndex}`}
            className="area"
            d={`${renderPath(area)} Z`}
          />
        ))}
      </svg>
      <nav id="mainNav" className={`menu menu--controls`}>
        <button onClick={() => saveFile(areas)}>Save</button>
        <button onClick={() => setIsEditing(false)}>Close</button>
      </nav>
    </div>
  );
}

export default FaceEditor;
