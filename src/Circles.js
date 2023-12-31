import React from "react";
import { processColor } from "./utils";

const Circles = ({ points, flatMask, setup, handsPointsCount }) => {
  const {
    transitionArrangement,
    radius,
    growth,
    color,
    opacity,
    hasTransition,
    transitionDuration
  } = setup;

  return flatMask
    .slice(0, -transitionArrangement - 1)
    .map((flatMaskPoint, index) => {
      const pointFrom = points[flatMaskPoint];
      const pointTo = points[flatMaskPoint + transitionArrangement];
      const getSize = (point) => {
        return (
          Math.max(
            0,
            (point || index - flatMask.length + handsPointsCount) + radius
          ) * growth
        );
      };
      const animationProps = {
        keyTimes: "0;1",
        dur: `${transitionDuration}s`,
        repeatCount: "indefinite"
      };

      return (
        <circle
          key={`c-${index}`}
          cx={pointFrom.x}
          cy={pointFrom.y}
          r={getSize(pointFrom.z)}
          stroke="none"
          fill={processColor(color, opacity)}
        >
          {hasTransition && (
            <>
              <animate
                attributeName="cx"
                values={`${pointFrom.x};${pointTo.x}`}
                {...animationProps}
              />
              <animate
                attributeName="cy"
                values={`${pointFrom.y};${pointTo.y}`}
                {...animationProps}
              />
              <animate
                attributeName="r"
                values={`${getSize(pointFrom.z)};${getSize(pointTo.z)}`}
                {...animationProps}
              />
            </>
          )}
        </circle>
      );
    });
};

export default Circles;
