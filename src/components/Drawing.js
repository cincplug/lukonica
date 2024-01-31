import React from "react";
import Images from "./patterns/Images";
import Paths from "./patterns/Paths";
import Numbers from "./patterns/Numbers";
import pathStrokes from "./patterns/path-strokes";
import { processColor } from "../utils";

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
    pathStroke,
    hasCursor,
    hasCursorFingertips,
    showsFaces
  } = setup;
  return (
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
      {!showsFaces &&
        [...scribble, scribbleNewArea].map(
          (scribbleArea, scribbleAreaIndex) => (
            <path
              fill="none"
              stroke={processColor(setup.color, setup.opacity)}
              strokeWidth={radius * growth}
              key={`scr-${scribbleAreaIndex}`}
              d={scribbleArea.map((thisPoint, thisPointIndex) => {
                const lastPoint = scribbleArea[scribbleArea.length - 1];
                if (!thisPoint || !lastPoint) return null;
                if (radius > 0 && lastPoint && thisPointIndex > 0) {
                  const deltaX = thisPoint.x - lastPoint.x;
                  const deltaY = thisPoint.y - lastPoint.y;
                  const h = Math.hypot(deltaX, deltaY) + radius;
                  const controlPoint = {
                    x: lastPoint.x + deltaX / 2 + deltaY / h,
                    y: lastPoint.y + deltaY / 2 - (radius * deltaX) / h
                  };
                  return pathStrokes({
                    pathStroke,
                    thisPoint,
                    controlPoint,
                    radius,
                    growth
                  });
                } else {
                  return `${thisPointIndex === 0 ? "M" : "L"} ${thisPoint.x},${
                    thisPoint.y
                  }`;
                }
              })}
            ></path>
          )
        )}
      {hasCursorFingertips && (
        <>
          <circle
            className={`cursor cursor--${
              cursor.isPinched ? "active" : "inactive"
            }`}
            r={2}
            cx={cursor.thumbTipX}
            cy={cursor.thumbTipY}
          ></circle>
          <circle
            className={`cursor cursor--${
              cursor.isPinched ? "active" : "inactive"
            }`}
            r={2}
            cx={cursor.indexTipX}
            cy={cursor.indexTipY}
          ></circle>
        </>
      )}
      {hasCursor && (
        <circle
          className={`cursor cursor--${
            cursor.isPinched ? "active" : "inactive"
          }`}
          r={6}
          cx={cursor.x}
          cy={cursor.y}
        ></circle>
      )}
    </svg>
  );
};

export default Drawing;
