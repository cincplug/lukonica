import React from "react";
import { processColor } from "../../utils";

const Sentence = ({ scribble, scribbleNewArea, setup, radius, growth }) => {
  const {
    text,
    textLimit,
    color,
    opacity,
    usesCssAnimation,
    transitionDuration,
    transitionArrangement
  } = setup;

  const textArray = Array.from(text);
  const area = [...scribble, scribbleNewArea]
    .flat()
    .slice(-Math.min(textLimit, textArray.length));

  const pathData = area.length
    ? area
        .map((point, index) => {
          return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
        })
        .join(" ") + " Z"
    : null;

  return (
    <svg>
      <path id="text-path" d={pathData} fill="none" />
      {textArray.map((letter, index) => {
        const style = usesCssAnimation
          ? {
              animation: `move-to ${transitionDuration}s linear infinite`
            }
          : null;
        const endOffset = (index / textArray.length) * 100;
        return (
          <text
            className={`number-mask`}
            fill={processColor(color, opacity)}
            key={`sent-${index}`}
            fontSize={radius  + textArray.length - index** growth}
            style={style}
          >
            <textPath href="#text-path" startOffset={`${endOffset}%`}>
              {transitionArrangement > 0 && (
                <animate
                  attributeName="startOffset"
                  from={`${endOffset}%`}
                  to={`${endOffset + transitionArrangement * radius}%`}
                  dur={transitionDuration * 10}
                  repeatCount="indefinite"
                />
              )}
              {letter}
            </textPath>
          </text>
        );
      })}
    </svg>
  );
};

export default Sentence;
