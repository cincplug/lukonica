import React, { useState } from "react";
import DEFAULT_FACE_POINTS from "../data/defaultFacePoints.json";
import { renderPath, saveJson } from "../utils";

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
            d={`${renderPath({
              area: activeArea,
              points: DEFAULT_FACE_POINTS
            })} L${mouseX},${mouseY}`}
          />
        ) : null}
        {DEFAULT_FACE_POINTS.map((point, pointIndex) => {
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
            className="face-editor__area"
            d={`${renderPath({ area, points: DEFAULT_FACE_POINTS })} Z`}
          />
        ))}
      </svg>
      <nav className="menu menu--controls">
        <fieldset className="control control--button">
          <button className="" onClick={() => saveJson(areas)}>
            Save
          </button>
        </fieldset>
        <fieldset className="control control--button">
          <button className="" onClick={() => setIsEditing(false)}>
            Close
          </button>
        </fieldset>
      </nav>
    </div>
  );
}

export default FaceEditor;
