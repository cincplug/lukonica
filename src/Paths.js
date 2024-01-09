import React from "react";
import { processColor, renderPath } from "./utils";

const Paths = ({ points, mask, setup, chunks, activeChunk }) => {
  const { pattern, radius, transitionArrangement } = setup;
  return (
    <>
      {mask.map((area, areaIndex) => (
        <path
          className="mask-path mask-path--default"
          key={`m-${areaIndex}`}
          fill={processColor(setup.color, setup.opacity)}
          d={`${renderPath({
            area: area.slice(0, -transitionArrangement - 1),
            points,
            radius: pattern === "curved paths" ? radius : 0
          })} Z`}
        >
          {setup.hasTransition && (
            <animate
              attributeName="d"
              values={`${renderPath({
                area: area.slice(0, -transitionArrangement - 1),
                points,
                radius: pattern === "curved paths" ? radius : 0
              })} Z;${renderPath({
                area: area.slice(1, -transitionArrangement),
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
            className="mask-path mask-path--chunk"
            d={`${renderPath({
              area: chunk,
              points,
              radius: pattern === "curved paths" ? radius : 0
            })} Z`}
          ></path>
        ))}
      {activeChunk && (
        <path
          className="mask-path mask-path--chunk mask-path--chunk--active"
          d={`${renderPath({
            area: activeChunk,
            points,
            radius: pattern === "curved paths" ? radius : 0
          })}`}
        ></path>
      )}
    </>
  );
};

export default Paths;
