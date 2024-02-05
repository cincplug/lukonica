import React from "react";
import Images from "./patterns/Images";
import Paths from "./patterns/Paths";
import Numbers from "./patterns/Numbers";
import Cursor from "./Cursor";
import Scribble from "./Scribble";

const Drawing = ({
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
}) => {
  const { width, height } = inputResolution;
  const {
    radius,
    growth,
    pattern,
    hasCursor,
    hasCursorFingertips,
    showsFaces
  } = setup;
  return (
    <>
      <svg
        className="drawing"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ mixBlendMode: setup.blendMode, width, height }}
      >
        {(() => {
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
        })()}
        {!showsFaces && (
          <Scribble
            scribble={scribble}
            scribbleNewArea={scribbleNewArea}
            setup={setup}
            radius={radius}
            growth={growth}
          />
        )}
      </svg>
      <Cursor
        cursor={cursor}
        hasCursor={hasCursor}
        hasCursorFingertips={hasCursorFingertips}
      />
    </>
  );
};

export default Drawing;
