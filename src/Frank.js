import React from "react";
import { processColor, renderPath } from "./utils";

const Frank = ({ points, mask, setup, chunks, activeChunk }) => {
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
          })} Z`}
          stroke="none"
        >
          {setup.hasTransition && (
            <animate
              attributeName="d"
              values={`${renderPath({
                area: area.slice(setup.transitionArrangement),
                points,
                radius: pattern === "curved paths" ? radius : 0
              })} Z;${renderPath({
                area: area.slice(0, -setup.transitionArrangement),
                points,
                radius: pattern === "curved paths" ? radius : 0
              })} Z`}
              keyTimes="0;1"
              dur={`${setup.transitionDuration}s`}
              repeatCount="indefinite"
            />
          )}
        </path>
      ))}
      {chunks &&
        chunks.map((chunk, chunkIndex) => (
          <path
            key={`ch-${chunkIndex}`}
            className="mask-path"
            stroke="#ffff00"
            strokeWidth={3}
            d={`${renderPath({
              area: chunk,
              points,
              radius: pattern === "curved paths" ? radius : 0
            })} Z`}
            fill="none"
          ></path>
        ))}
      {activeChunk && (
        <path
          className="mask-path"
          stroke="#ff00ff"
          strokeWidth={3}
          d={`${renderPath({
            area: activeChunk,
            points,
            radius: pattern === "curved paths" ? radius : 0
          })}`}
          fill="none"
        ></path>
      )}
    </>
  );
};

export default Frank;
