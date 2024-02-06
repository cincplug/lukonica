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

  return area.map((point, index) => {
    const style = usesCssAnimation
      ? {
          animation: `move-to ${transitionDuration}s linear infinite`,
          animationDelay: `${-index * transitionDuration}s`,
          "--dx": `${area[Math.max(0, index - 1)].x - point.x}px`,
          "--dy": `${area[Math.max(0, index - 1)].y - point.y}px`
        }
      : null;
    const letter = shiftedTextArray[index];
    return (
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
    );
  });
};

export default Sentence;
