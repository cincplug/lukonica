import React from "react";
import Images from "./patterns/Images";
import Paths from "./patterns/Paths";
import Numbers from "./patterns/Numbers";
import Ball from "./Ball";

const Drawing = (props) => {
  const {
    inputResolution,
    setup,
    points,
    flatMask,
    cursor,
    customMask,
    customMaskNewArea,
    activeMask,
    ball
  } = props;
  const { width, height } = inputResolution;
  const { pattern, activeScenarioIndex } = setup;
  // const { muzzle } = cursor;
  return (
    <svg
      className="drawing"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      style={{
        mixBlendMode: setup.blendMode,
        width,
        height,
        transform: `scale(${setup.zoom})`
      }}
    >
      {(() => {
        switch (pattern) {
          case "images":
            return (
              <Images
                {...{
                  points,
                  flatMask,
                  setup
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
                  customMask,
                  customMaskNewArea
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
      {/* {muzzle && activeScenarioIndex === 7 && (
        <path
          className="laser"
          strokeDasharray={[10, 15]}
          d={`M${muzzle.x}, ${muzzle.y} V0`}
        ></path>
      )} */}
      {points.length && [8,9].includes(activeScenarioIndex) && (
        <Ball setup={setup} ball={ball} />
      )}
    </svg>
  );
};

export default Drawing;
