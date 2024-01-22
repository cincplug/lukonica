import React from "react";
import bubble from "../../assets/bubble.png";
import { getDistance } from "../../utils";

const Images = ({ points, flatMask, setup, cursor }) => {
  const {
    transitionArrangement,
    radius,
    growth,
    transitionDuration,
    lowThreshold,
    gripThreshold
  } = setup;

  return flatMask.map((flatMaskPoint, index) => {
    const pointFrom = points[flatMaskPoint];
    const pointTo =
      points[(flatMaskPoint + transitionArrangement) % points.length];
    if (!pointFrom || getDistance(cursor, pointFrom) < gripThreshold) {
      return null;
    }
    const size =
      Math.max(
        lowThreshold,
        (index + radius) /
          ((index % (lowThreshold + 1)) * lowThreshold || radius / lowThreshold)
      ) +
      radius * growth;
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
        width={size}
        href={setup.imageUrl || bubble}
        transform={`translate(${-size / 2})`}
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
              values={`${size};${size}`}
              {...animationProps}
            />
          </>
        )}
      </image>
    );
  });
};

export default Images;
