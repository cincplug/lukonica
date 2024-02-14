import React from "react";
import { processColor } from "../../utils";

const Train = ({ scribble, scribbleNewArea, setup }) => {
  const {
    text,
    textLimit,
    color,
    opacity,
    transitionDuration,
    transitionArrangement
  } = setup;

  const textArray = Array.from(text);
  const fullArea = [...scribble, scribbleNewArea].flat().reverse();

  const area = fullArea.slice(-Math.min(textLimit, textArray.length));

  const pathData = area
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");

  return (
    <svg>
      <path id="text-path" d={pathData} stroke={setup.color} fill="none" />
      <text
        className={`number-mask`}
        fill={processColor(color, opacity)}
        fontSize={30}
      >
        <textPath href="#text-path">
          {transitionArrangement > 0 && (
            <animate
              attributeName="startOffset"
              to={`0%`}
              from={`100%`}
              dur={transitionDuration * 10}
              repeatCount="indefinite"
            />
          )}
          {text}
        </textPath>
      </text>
    </svg>
  );
};

export default Train;
