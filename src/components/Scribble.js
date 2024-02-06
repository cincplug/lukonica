import React from "react";
import pathStrokes from "./patterns/path-strokes";
import { processColor } from "../utils";

const Scribble = ({ scribble, scribbleNewArea, setup, radius, growth }) => {
  const {
    pattern,
    text,
    textLimit,
    color,
    opacity,
    pathStroke,
    usesCssAnimation,
    transitionDuration
  } = setup;
  const textArray = Array.from(text);
  if (pattern === "sentences") {
    const area = [...scribble, scribbleNewArea]
      .flat()
      .slice(-Math.min(textLimit, textArray.length));

    return area.map((point, index) => {
      const style = usesCssAnimation
        ? {
            animation: `move-to ${transitionDuration}s forwards`,
            "--dx": `${area[Math.max(0, index - 1)].x - point.x}px`,
            "--dy": `${area[Math.max(0, index - 1)].y - point.y}px`
          }
        : null;
      const letter = textArray[index];
      return (
        <>
          <text
            className={`number-mask`}
            fill={processColor(color, opacity)}
            key={`sent-${index}`}
            x={point.x}
            y={point.y}
            style={style}
            fontSize={radius + index * growth}
          >
            {letter}
          </text>
          <line
            stroke={processColor(color, opacity)}
            x1={point.x}
            y1={point.y}
            x2={area[Math.max(0, index - 1)].x}
            y2={area[Math.max(0, index - 1)].y}
          ></line>
        </>
      );
    });
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
                pathStroke: pathStroke,
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
