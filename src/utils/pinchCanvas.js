import { processColor, getDistance } from "./index";

export const pinchCanvas = ({
  radius,
  thumbIndexDistance,
  growth,
  minimum,
  ctx,
  color,
  opacity,
  dynamics,
  x,
  y,
  lastX,
  lastY
}) => {
  let targetLineWidth = (radius - thumbIndexDistance) * growth + minimum;
  ctx.lineWidth = (targetLineWidth * dynamics - ctx.lineWidth) / (dynamics + 1);
  ctx.strokeStyle = processColor(color, opacity);
  if (!lastX) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.quadraticCurveTo(lastX, lastY, x, y);
    ctx.stroke();
    if (getDistance({ x, y }, { x: lastX, y: lastY }) > radius * growth) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }
  lastX = x;
  lastY = y;
  return { lastX, lastY };
};
