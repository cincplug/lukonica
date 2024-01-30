import React, { useState } from "react";
import DEFAULT_FACE_POINTS from "../data/defaultFacePoints.json";
import { renderPath, saveJson } from "../utils";

function FaceEditor(props) {
  const { inputResolution, setIsEditing } = props;
  const [faceAreas, setFaceAreas] = useState([]);
  const [activeFaceArea, setActiveFaceArea] = useState([]);
  const [mouseX, setMouseX] = useState(inputResolution.width / 2);
  const [mouseY, setMouseY] = useState(inputResolution.height / 2);

  const handleDotClick = (_event, pointIndex) => {
    if (activeFaceArea.length === 0) {
      setActiveFaceArea([pointIndex]);
    } else {
      if (activeFaceArea[0] === pointIndex) {
        setFaceAreas((prevFaceAreas) => {
          console.info([...prevFaceAreas, activeFaceArea]);
          return [...prevFaceAreas, activeFaceArea];
        });
        setActiveFaceArea([]);
      } else {
        setActiveFaceArea((prevActiveFaceArea) => {
          return [...prevActiveFaceArea, pointIndex];
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
        {activeFaceArea.length > 0 ? (
          <path
            className="face-editor__active-area"
            d={`${renderPath({
              area: activeFaceArea,
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
                activeFaceArea[0] === pointIndex ? "face-editor__dot--first" : ""
              }`}
              onClick={(event) => handleDotClick(event, pointIndex)}
            />
          );
        })}

        {faceAreas.map((area, areaIndex) => (
          <path
            key={`a-${areaIndex}`}
            className="face-editor__area"
            d={`${renderPath({ area, points: DEFAULT_FACE_POINTS })} Z`}
          />
        ))}
      </svg>
      <nav className="menu menu--controls">
        <fieldset className="control control--button">
          <button className="" onClick={() => saveJson(faceAreas)}>
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
