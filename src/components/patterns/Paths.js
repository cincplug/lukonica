import React from "react";
import { processColor, renderPath } from "../../utils";

const Paths = ({ points, mask, setup, chunks, activeChunk }) => {
  const { pattern, transitionArrangement } = setup;
  const radius = pattern === "curved paths" ? setup.radius : 0;
  return (
    <>
      {mask.map((area, areaIndex) => (
        <path
          className="mask-path mask-path--default"
          key={`m-${areaIndex}`}
          fill={processColor(setup.color, setup.opacity)}
          d={`${renderPath({
            area: area.slice(0, area.length - transitionArrangement),
            points,
            radius
          })} Z`}
        >
          {transitionArrangement && (
            <animate
              attributeName="d"
              values={`${renderPath({
                area: area.slice(0, area.length - transitionArrangement),
                points,
                radius
              })} Z;${renderPath({
                area: area.slice(-area.length + transitionArrangement),
                points,
                radius
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
              radius
            })} Z`}
          ></path>
        ))}
      {activeChunk && (
        <path
          className="mask-path mask-path--chunk mask-path--chunk--active"
          d={`${renderPath({
            area: activeChunk,
            points,
            radius
          })}`}
        ></path>
      )}
    </>
  );
};

export default Paths;
