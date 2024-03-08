import { processColor } from "./index";

export const scratchCanvas = ({
  radius,
  growth,
  minimum,
  ctx,
  color,
  opacity,
  tips,
  scratchPattern,
  lastTips
}) => {
  let targetLineWidth = radius * growth + minimum;
  ctx.strokeStyle = processColor(color, opacity);
  if (lastTips) {
    ctx.beginPath();
    if (scratchPattern === "quadratics" || scratchPattern === "tetrics") {
      const tipValues = Object.values(tips);
      tipValues.forEach((tip, tipIndex) => {
        const prevIndex = tipIndex === 0 ? tipValues.length - 1 : tipIndex - 1;
        if (scratchPattern === "quadratics") {
          ctx.quadraticCurveTo(
            tipValues[tipIndex].x,
            tipValues[tipIndex].y,
            tipValues[prevIndex].x,
            tipValues[prevIndex].y
          );
        } else {
          ctx.rect(
            tipValues[tipIndex].x,
            tipValues[tipIndex].y,
            tipValues[prevIndex].x - tipValues[tipIndex].x,
            tipValues[prevIndex].y - tipValues[tipIndex].y
          );
        }
      });
    }
    Object.keys(tips).forEach((tip, tipIndex) => {
      ctx.moveTo(lastTips[tip].x, lastTips[tip].y);
      ctx.lineWidth = targetLineWidth - ctx.lineWidth + tipIndex;
      if (scratchPattern === "lines") {
        ctx.quadraticCurveTo(
          lastTips[tip].x,
          lastTips[tip].y,
          tips[tip].x,
          tips[tip].y
        );
      }
      if (scratchPattern === "rectangles") {
        ctx.rect(
          lastTips[tip].x,
          lastTips[tip].y,
          tips[tip].x - lastTips[tip].x,
          tips[tip].y - lastTips[tip].y
        );
      }
      ctx.stroke();
    });
    ctx.lineJoin = "bevel";
  }
  lastTips = { ...tips };
  return lastTips;
};
