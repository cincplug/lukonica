import React, { useState } from "react";
import DEFAULT_FACE_POINTS from "../data/defaultFacePoints.json";
import { renderPath, saveJson } from "../utils";

function MaskEditor(props) {
  const { inputResolution, setIsEditing } = props;
  const [customMask, setCustomMask] = useState([]);
  const [customMaskNewArea, setCustomMaskNewArea] = useState([]);
  const [mouseX, setMouseX] = useState(inputResolution.width / 2);
  const [mouseY, setMouseY] = useState(inputResolution.height / 2);

  const handleDotClick = (_event, pointIndex) => {
    if (customMaskNewArea.length === 0) {
      setCustomMaskNewArea([pointIndex]);
    } else {
      if (customMaskNewArea[0] === pointIndex) {
        setCustomMask((prevCustomMask) => {
          console.info([...prevCustomMask, customMaskNewArea]);
          return [...prevCustomMask, customMaskNewArea];
        });
        setCustomMaskNewArea([]);
      } else {
        setCustomMaskNewArea((prevCustomMaskNewArea) => {
          return [...prevCustomMaskNewArea, pointIndex];
        });
      }
    }
  };
  const handleMouseMove = (event) => {
    setMouseX(event.pageX || event.touches[0].pageX);
    setMouseY(event.pageY || event.touches[0].pageY);
  };

  return (
    <div className="mask-editor" onMouseMove={handleMouseMove}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${inputResolution.width} ${inputResolution.height}`}
      >
        {customMaskNewArea.length > 0 ? (
          <path
            className="mask-editor__new-area"
            d={`${renderPath({
              area: customMaskNewArea,
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
              className={`mask-editor__dot ${
                customMaskNewArea[0] === pointIndex ? "mask-editor__dot--first" : ""
              }`}
              onClick={(event) => handleDotClick(event, pointIndex)}
            />
          );
        })}

        {customMask.map((area, areaIndex) => (
          <path
            key={`a-${areaIndex}`}
            className="mask-editor__area"
            d={`${renderPath({ area, points: DEFAULT_FACE_POINTS })} Z`}
          />
        ))}
      </svg>
      <nav className="menu menu--controls">
        <fieldset className="control control--button">
          <button className="" onClick={() => saveJson(customMask)}>
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

export default MaskEditor;
