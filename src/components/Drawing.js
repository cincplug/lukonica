import React from "react";
import Images from "./patterns/Images";
import Paths from "./patterns/Paths";
import Numbers from "./patterns/Numbers";

const Drawing = ({
  inputResolution,
  setup,
  points,
  flatMask,
  cursor,
  chunks,
  activeChunk,
  activeMask,
  scribble
}) => {
  const { width, height } = inputResolution;
  return (
    <svg
      className="drawing"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      style={{ mixBlendMode: setup.blendMode, width, height }}
    >
      {(() => {
        switch (setup.pattern) {
          case "images":
            return (
              <Images
                {...{
                  points,
                  flatMask,
                  setup,
                  cursor
                }}
              />
            );
          case "paths":
            return (
              <Paths
                {...{
                  points,
                  activeMask,
                  setup,
                  chunks,
                  activeChunk,
                  cursor
                }}
              />
            );
          case "numbers":
            return (
              <Numbers
                {...{
                  points,
                  flatMask,
                  setup,
                  cursor
                }}
              />
            );
          default:
            return null;
        }
      })()}
      {scribble && (
        <path
          fill="none"
          stroke={setup.color}
          strokeWidth={setup.radius}
          d={scribble.map((point, index) => {
            return `${index === 0 ? "M" : "L"} ${point.x},${point.y}`;
          })}
        ></path>
      )}
    </svg>
  );
};

export default Drawing;
