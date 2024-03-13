import { processColor, getDistance } from "./index";

export const pinchCanvas = ({
  radius,
  thumbIndexDistance,
  growth,
  minimum,
  ctx,
  color,
  opacity,
  pinchThreshold,
  x,
  y,
  lastX,
  lastY
}) => {
  let targetLineWidth = Math.max(
    (radius - thumbIndexDistance) * growth + minimum
  );
  ctx.lineWidth = (targetLineWidth - ctx.lineWidth) / 2;
  ctx.strokeStyle = processColor(color, opacity);
  if (!lastX) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.quadraticCurveTo(lastX, lastY, x, y);
    ctx.lineJoin = "bevel";
    ctx.stroke();
    if (getDistance({ x, y }, { x: lastX, y: lastY }) > pinchThreshold) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }
  lastX = x;
  lastY = y;
  return { lastX, lastY };
};
