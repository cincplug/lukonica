import DEFAULT_HAND_POINTS from "../../data/defaultHandPoints.json";
import React, { useState } from "react";

function HandPointSelection() {
  const [handPoints, setHandPoints] = useState([]);

  const handlePointClick = (index) => {
    if (handPoints.includes(index)) {
      setHandPoints(handPoints.filter((point) => point !== index));
    } else {
      setHandPoints([...handPoints, index]);
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="hand-selection"
      viewBox="0 0 500 500"
    >
      {DEFAULT_HAND_POINTS.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={20}
          onClick={() => handlePointClick(index)}
          className={`hand-point ${
            handPoints.includes(index) ? "selected" : "not-selected"
          }`}
        >
          {index}
        </circle>
      ))}
    </svg>
  );
}

export default HandPointSelection;
