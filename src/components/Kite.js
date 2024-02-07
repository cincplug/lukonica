import React from "react";
import { processColor } from "../utils";

const Sentence = ({ scribble, scribbleNewArea, setup, radius, growth }) => {
  const {
    text,
    textLimit,
    color,
    opacity,
    usesCssAnimation,
    transitionDuration
  } = setup;

  const textArray = Array.from(text);
  const area = [...scribble, scribbleNewArea]
    .flat()
    .slice(-Math.min(textLimit, textArray.length));

  let shiftedTextArray = textArray;
  if (area.length >= textArray.length) {
    shiftedTextArray = textArray
      .slice(area.length % textArray.length)
      .concat(textArray.slice(0, area.length % textArray.length));
  }

  const pathData = area.map((point, index) => {
    return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
  }).join(" ");

  return (
    <svg>
      <path id="text-path" d={pathData} fill="none" />
      {shiftedTextArray.map((letter, index) => {
        const style = usesCssAnimation
          ? {
              animation: `move-to ${transitionDuration}s linear infinite`,
              animationDelay: `${-index * transitionDuration}s`
            }
          : null;
        return (
          <text
            className={`number-mask`}
            fill={processColor(color, opacity)}
            key={`sent-${index}`}
            fontSize={radius + index * growth}
            style={style}
          >
            <textPath href="#text-path" startOffset={`${(index / shiftedTextArray.length) * 100}%`}>
              {letter}
            </textPath>
          </text>
        );
      })}
    </svg>
  );
};

export default Sentence;
