import React from "react";
import Images from "./patterns/Images";
import Paths from "./patterns/Paths";
import Numbers from "./patterns/Numbers";
import Cursor from "./Cursor";
import Scribble from "./Scribble";
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
    scribble,
    scribbleNewArea
  } = props;
  const { width, height } = inputResolution;
  const {
    radius,
    growth,
    pattern,
    hasCursor,
    hasCursorFingertips,
    showsFaces,
    activeScenarioIndex,
    bg
  } = setup;
  const { muzzle } = cursor;
  return (
    <>
      <svg
        className="bg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ width, height }}
      >
        <rect width={width} height={height} fill={bg}></rect>
      </svg>
      <svg
        className="drawing"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ mixBlendMode: setup.blendMode, width, height }}
      >
        {showsFaces ? (
          (() => {
            switch (pattern) {
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
          })()
        ) : (
          <Scribble
            scribble={scribble}
            scribbleNewArea={scribbleNewArea}
            setup={setup}
            radius={radius}
            growth={growth}
          />
        )}
        {muzzle && activeScenarioIndex === 7 && (
          <path
            className="laser"
            strokeDasharray={[10, 15]}
            d={`M${muzzle.x}, ${muzzle.y} V0`}
          ></path>
        )}
        {points.length && activeScenarioIndex === 8 && <Ball setup={setup} />}
      </svg>
      {hasCursor && (
        <Cursor cursor={cursor} hasCursorFingertips={hasCursorFingertips} />
      )}
    </>
  );
};

export default Drawing;
