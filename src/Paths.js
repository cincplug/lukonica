import React from "react";
import { processColor, renderPath } from "./utils";

const Paths = ({ points, mask, setup }) => {
  const { pattern, radius } = setup;
  return (
    <>
      {mask.map((area, areaIndex) => (
        <path
          className="mask-path"
          key={`m-${areaIndex}`}
          fill={processColor(setup.color, setup.opacity)}
          d={`${renderPath({
            area: area.slice(setup.transitionArrangement),
            points,
            radius: pattern === "curved paths" ? radius : 0
          })}`}
          stroke="none"
        >
          {setup.hasTransition && (
            <animate
              attributeName="d"
              values={`${renderPath({
                area: area.slice(setup.transitionArrangement),
                points,
                radius: pattern === "curved paths" ? radius : 0
              })};${renderPath({
                area: area.slice(0, -setup.transitionArrangement),
                points,
                radius: pattern === "curved paths" ? radius : 0
              })}`}
              keyTimes="0;1"
              dur={`${setup.transitionDuration}s`}
              repeatCount="indefinite"
            />
          )}
        </path>
      ))}
    </>
  );
};

export default Paths;
