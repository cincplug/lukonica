import React from "react";
import { processColor } from "../../utils";

const Numbers = ({ points, setup, cursor }) => {
  return (
    <>
      {points.map((point, pointIndex) => {
        return (
          <text
            key={`c-${pointIndex}`}
            fill={processColor(setup.color, setup.opacity)}
            x={point.x}
            y={point.y}
            className={`number-pattern`}
          >
            {pointIndex}
          </text>
        );
      })}
      <circle
        className={`cursor cursor--${cursor.isActive ? "active" : "inactive"}`}
        r={6}
        cx={cursor.x}
        cy={cursor.y}
      ></circle>
    </>
  );
};

export default Numbers;
