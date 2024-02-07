import React from "react";
import pathStrokes from "./patterns/path-strokes";
import { processColor } from "../utils";
import Sentence from "./Sentence";
import Kite from "./Kite";
import Train from "./Train";

const Scribble = ({ scribble, scribbleNewArea, setup, radius, growth }) => {
  const { pattern, color, opacity, pathStroke } = setup;

  if (pattern === "sentences") {
    return (
      <Sentence
        scribble={scribble}
        scribbleNewArea={scribbleNewArea}
        setup={setup}
        radius={radius}
        growth={growth}
      />
    );
  }
  if (pattern === "kite") {
    return (
      <Kite
        scribble={scribble}
        scribbleNewArea={scribbleNewArea}
        setup={setup}
        radius={radius}
        growth={growth}
      />
    );
  }
  if (pattern === "train") {
    return (
      <Train
        scribble={scribble}
        scribbleNewArea={scribbleNewArea}
        setup={setup}
        radius={radius}
        growth={growth}
      />
    );
  }
  return (
    <>
      {[...scribble, scribbleNewArea].map((scribbleArea, scribbleAreaIndex) => (
        <path
          className="scribble"
          fill="none"
          stroke={processColor(color, opacity)}
          strokeWidth={radius * growth}
          key={`scr-${scribbleAreaIndex}`}
          d={scribbleArea.map((thisPoint, thisPointIndex) => {
            const lastPoint = scribbleArea[scribbleArea.length - 1] || thisPoint;
            const prevPoint = scribbleArea[Math.max(0, thisPointIndex - 1)] || thisPoint;
            const nextPoint =
              scribbleArea[
                Math.min(thisPointIndex + 1, scribbleArea.length - 1)
              ];
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
                pathStroke: pathStroke,
                thisPoint,
                prevPoint,
                nextPoint,
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
