import React from "react";
import { processColor } from "./utils";
import bubble from "./masks/bubble.png";

const Images = ({ points, flatMask, setup, handsPointsCount }) => {
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
        <image
          key={`c-${index}`}
          x={pointFrom.x}
          y={pointFrom.y}
          width={getSize(pointFrom.z)}
          href={bubble}
        >
          {hasTransition && (
            <>
              <animate
                attributeName="x"
                values={`${pointFrom.x};${pointTo.x}`}
                {...animationProps}
              />
              <animate
                attributeName="y"
                values={`${pointFrom.y};${pointTo.y}`}
                {...animationProps}
              />
              <animate
                attributeName="width"
                values={`${getSize(pointFrom.z)};${getSize(pointTo.z)}`}
                {...animationProps}
              />
            </>
          )}
        </image>
      );
    });
};

export default Images;
