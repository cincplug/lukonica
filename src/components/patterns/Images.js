import React from "react";
import bubble from "../../assets/img/bubble.png";
import { getDistance } from "../../utils";

const Images = ({ points, flatMask, setup, cursor }) => {
  const {
    transitionArrangement,
    radius,
    growth,
    transitionDuration,
    minimum,
    pinchThreshold,
    usesSvgAnimation,
    usesCssAnimation
  } = setup;

  return flatMask.map((flatMaskPoint, index) => {
    const pointFrom = points[flatMaskPoint];
    const pointTo =
      points[
        (flatMaskPoint - transitionArrangement + points.length) % points.length
      ];

    if (!pointFrom || getDistance(cursor, pointFrom) < pinchThreshold) {
      return null;
    }
    const getSize = (point = index) => {
      return (
        Math.max(
          minimum,
          (point + radius) / ((index % transitionArrangement) + minimum)
        ) +
        radius * growth
      );
    };
    const animationProps = {
      keyTimes: "0;1",
      dur: `${transitionDuration}s`,
      repeatCount: "indefinite"
    };
    const opacityStyle = { opacity: setup.opacity / 255 };
    const animationStyle = usesCssAnimation
      ? {
          animation: `move-to ${transitionDuration}s infinite`,
          "--dx": `${pointTo.x - pointFrom.x}px`,
          "--dy": `${pointTo.y - pointFrom.y}px`
        }
      : null;
    const style = { ...opacityStyle, ...animationStyle };

    return (
      <image
        key={`c-${index}`}
        x={pointFrom.x}
        y={pointFrom.y}
        width={getSize(pointFrom.z)}
        href={setup.imageUrl || bubble}
        style={style}
      >
        {transitionArrangement && usesSvgAnimation && (
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
