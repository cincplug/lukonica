import React, { useEffect } from "react";
import { processColor, renderPath } from "../../utils";

const Path = ({ area, points, className, pathRef, setup, ...commonProps }) => {
  const {
    radius,
    transitionDuration,
    usesCssAnimation,
    usesSvgAnimation,
    transitionArrangement
  } = setup;

  useEffect(() => {
    if (usesCssAnimation && pathRef && pathRef.current) {
      if (area && points && radius) {
        const newPath = renderPath({ area, points, radius });
        pathRef.current.setAttribute("d", newPath);
      }
    }
  }, [area, pathRef, points, radius, usesCssAnimation]);

  return (
    <path
      ref={pathRef}
      className={className}
      fill={processColor(setup.color, setup.opacity)}
      d={
        area && points && radius
          ? `${renderPath({ area, points, radius })} Z`
          : ""
      }
      style={
        usesCssAnimation
          ? { transition: `d ${transitionDuration / 10}s linear` }
          : null
      }
      {...commonProps}
    >
      {transitionArrangement && usesSvgAnimation && (
        <animate
          attributeName="d"
          values={`${renderPath({
            area,
            points,
            radius
          })} Z;${renderPath({
            area: [
              ...area.slice(transitionArrangement),
              ...area.slice(0, transitionArrangement)
            ],
            points,
            radius
          })} Z`}
          keyTimes="0;1"
          dur={`${setup.transitionDuration}s`}
          repeatCount="indefinite"
        />
      )}
    </path>
  );
};

export default Path;
