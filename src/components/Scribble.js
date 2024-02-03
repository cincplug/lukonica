import React from "react";
import pathStrokes from "./patterns/path-strokes";
import { processColor } from "../utils";

const Scribble = ({ scribble, scribbleNewArea, setup, radius, growth }) => {
  return (
    <>
      {[...scribble, scribbleNewArea].map((scribbleArea, scribbleAreaIndex) => (
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
                pathStroke: setup.pathStroke,
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
      ))}
    </>
  );
};

export default Scribble;
