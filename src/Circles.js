import React from "react";
import { processColor } from "./utils";

const Circles = ({ points, flatMask, setup, handsPointsCount }) => {
  return flatMask.slice(0, -setup.transitionArrangement - 1).map((flatMaskPoint, index) => (
    <circle
      key={`c-${index}`}
      cx={points[flatMaskPoint + setup.transitionArrangement].x}
      cy={points[flatMaskPoint + setup.transitionArrangement].y}
      r={
        Math.max(
          0,
          (points[flatMaskPoint].z ||
            index - flatMask.length + handsPointsCount) + setup.radius
        ) * setup.growth
      }
      stroke="none"
      fill={processColor(setup.color, setup.opacity)}
    >
      {setup.hasTransition && (
        <>
          <animate
            attributeName="cx"
            values={`${points[flatMaskPoint].x};${
              points[flatMaskPoint + setup.transitionArrangement].x
            }`}
            keyTimes="0;1"
            dur={`${setup.transitionDuration}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${points[flatMaskPoint].y};${
              points[flatMaskPoint + setup.transitionArrangement].y
            }`}
            keyTimes="0;1"
            dur={`${setup.transitionDuration}s`}
            repeatCount="indefinite"
          />
        </>
      )}
    </circle>
  ));
};

export default Circles;
