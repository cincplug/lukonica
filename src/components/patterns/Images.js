import React from "react";
import bubble from "../../assets/bubble.png";
import { getDistance } from "../../utils";

const Images = ({ points, flatMask, setup, cursor, flatMaskLength }) => {
  const {
    transitionArrangement,
    radius,
    growth,
    transitionDuration,
    lowThreshold,
    gripThreshold
  } = setup;

  return flatMask
    .slice(0, -transitionArrangement - 1)
    .map((flatMaskPoint, index) => {
      const pointFrom = points[flatMaskPoint];
      const pointTo =
        points[Math.max(flatMaskPoint - transitionArrangement, 0)];
      if (!pointFrom || getDistance(cursor, pointFrom) < gripThreshold) {
        return null;
      }
      const getSize = (point) => {
        const handFactor = transitionArrangement + 2;
        return (
          Math.max(
            lowThreshold,
            (index + radius) /
              ((index % (handFactor + 1)) * handFactor || radius / handFactor)
          ) +
          radius * growth
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
          href={setup.imageUrl || bubble}
          transform={`translate(${-getSize(pointFrom.z) / 2})`}
        >
          {transitionArrangement && (
            <>
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
              </>
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
