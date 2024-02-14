import React from "react";
import pathStrokes from "./patterns/path-strokes";
import { processColor } from "../utils";
import Sentence from "./patterns/Sentence";
import Kite from "./patterns/Kite";

const Scribble = ({ scribble, scribbleNewArea, setup }) => {
  const {
    pattern,
    color,
    opacity,
    pathStroke,
    transitionArrangement,
    transitionDuration,
    text,
    radius,
    growth,
    minimum,
    textLimit
  } = setup;

  const textArray = Array.from(text);

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
  return (
    <>
      {[...scribble, scribbleNewArea].map((scribbleArea, scribbleAreaIndex) => {
        const fullArea = scribbleArea.flat().reverse();
        const area = fullArea.slice(-Math.min(textLimit, textArray.length));
        const pathData = area
          .map((point, index) => {
            const lastPoint = area[area.length - 1] || point;
            const prevPoint = area[Math.max(0, index - 1)] || point;
            const nextPoint = area[Math.min(index + 1, area.length - 1)];
            if (!point || !lastPoint) return null;
            if (radius > 0 && lastPoint && index > 0) {
              const deltaX = point.x - lastPoint.x;
              const deltaY = point.y - lastPoint.y;
              const h = Math.hypot(deltaX, deltaY) + radius;
              const controlPoint = {
                x: lastPoint.x + deltaX / 2 + deltaY / h,
                y: lastPoint.y + deltaY / 2 - (radius * deltaX) / h
              };
              return pathStrokes({
                pathStroke: pathStroke,
                thisPoint: point,
                prevPoint,
                nextPoint,
                controlPoint,
                radius,
                growth
              });
            } else {
              return `${index === 0 ? "M" : "L"} ${point.x},${point.y}`;
            }
          })
          .join(" ");
        return (
          <>
            <path
              id={`text-path-${scribbleAreaIndex}`}
              className="scribble"
              fill="none"
              stroke={processColor(color, opacity)}
              strokeWidth={radius * growth}
              key={`scr-${scribbleAreaIndex}`}
              d={pathData} // Use pathData from Train component
            ></path>
            {text && (
              <text
                className={`number-mask`}
                fill={processColor(color, opacity)}
                fontSize={radius * minimum + scribbleAreaIndex}
              >
                <textPath href={`#text-path-${scribbleAreaIndex}`}>
                  {transitionArrangement > 0 && (
                    <animate
                      attributeName="startOffset"
                      to={`${transitionArrangement}%`}
                      from={`${100 - transitionArrangement}%`}
                      dur={transitionDuration * 10}
                      repeatCount="indefinite"
                    />
                  )}
                  {text}
                </textPath>
              </text>
            )}
          </>
        );
      })}
    </>
  );
};

export default Scribble;
