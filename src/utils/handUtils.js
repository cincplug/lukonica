import {
  processColor,
  findClosestFacePointIndex,
  getDistance,
  checkElementPinch
} from "./index";

let lastX, lastY, lastTips;

export const processHands = ({
  setupRef,
  hands,
  points,
  setCursor,
  setCustomMaskNewArea,
  setCustomMask,
  setScribbleNewArea,
  ctx
}) => {
  const {
    pattern,
    radius,
    color,
    opacity,
    growth,
    minimum,
    pinchThreshold,
    usesButtonPinch,
    showsFaces,
    transitionArrangement,
    hasCursorFingertips
  } = setupRef.current;
  let newPoints = [];
  if (!["paths"].includes(pattern)) {
    hands.forEach((hand) => {
      if (hand.keypoints) {
        newPoints = newPoints.concat(hand.keypoints);
      }
    });
  }
  const wrist = hands[0]?.keypoints[0];
  const thumbTip = hands[0]?.keypoints[4];
  const indexTip = hands[0]?.keypoints[8];
  const middleTip = hands[0]?.keypoints[12];
  const ringyTip = hands[0]?.keypoints[16];
  const pinkyTip = hands[0]?.keypoints[20];
  const thumbIndexDistance = getDistance(thumbTip, indexTip);
  const isPinched = thumbIndexDistance < pinchThreshold;
  const isWagging =
    !isPinched &&
    (wrist.y - indexTip.y) / (wrist.y - middleTip.y) > 2 &&
    (wrist.y - indexTip.y) / (wrist.x - indexTip.x) > 2;
  const x = (thumbTip.x + indexTip.x) / 2;
  const y = (thumbTip.y + indexTip.y) / 2;
  setCursor((prevCursor) => {
    const threshold = prevCursor.isPinched
      ? pinchThreshold * 2
      : pinchThreshold;
    if (usesButtonPinch && thumbIndexDistance < pinchThreshold * 4) {
      checkElementPinch({ x, y, isPinched });
    }
    return {
      x,
      y,
      thumbTip,
      indexTip,
      middleTip,
      ringyTip,
      pinkyTip,
      isWagging,
      isPinched: thumbIndexDistance < threshold
    };
  });

  if (showsFaces && isPinched) {
    const closestPoint = findClosestFacePointIndex({
      facePoints: points,
      indexTip,
      pinchThreshold
    });

    if (closestPoint) {
      setCustomMaskNewArea((prevCustomMaskNewArea) => {
        const isNewArea =
          prevCustomMaskNewArea.length === 0 ||
          prevCustomMaskNewArea[0] !== closestPoint;
        if (isNewArea) {
          return [...prevCustomMaskNewArea, closestPoint];
        } else {
          setCustomMask((prevCustomMask) => [
            ...prevCustomMask,
            prevCustomMaskNewArea
          ]);
          return [];
        }
      });
    }
  }
  if (!showsFaces) {
    if (pattern === "canvas" && ctx) {
      if (isWagging) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        lastX = undefined;
        lastY = undefined;
        lastTips = undefined;
      }
      if (hasCursorFingertips) {
        const tips = {
          thumbTip,
          indexTip,
          middleTip,
          ringyTip,
          pinkyTip
        };
        processScratchCanvas({
          radius,
          growth,
          minimum,
          ctx,
          color,
          opacity,
          tips
        });
      } else {
        lastTips = undefined;
      }
      if (isPinched && !hasCursorFingertips) {
        processPinchCanvas({
          radius,
          thumbIndexDistance,
          growth,
          minimum,
          ctx,
          color,
          opacity,
          transitionArrangement,
          x,
          y
        });
      } else {
        lastX = undefined;
        lastY = undefined;
      }
    } else if (isPinched) {
      setScribbleNewArea((prevScribbleNewArea) => {
        const isNewArea =
          prevScribbleNewArea.length === 0 ||
          getDistance(prevScribbleNewArea[prevScribbleNewArea.length - 1], {
            x,
            y
          }) > minimum;
        if (isNewArea) {
          return [...prevScribbleNewArea, { x, y }];
        }
        return prevScribbleNewArea;
      });
    }
  }
  return [...points, ...newPoints];
};

const processPinchCanvas = ({
  radius,
  thumbIndexDistance,
  growth,
  minimum,
  ctx,
  color,
  opacity,
  transitionArrangement,
  x,
  y
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
    if (
      getDistance({ x, y }, { x: lastX, y: lastY }) >
      transitionArrangement * 5
    ) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }
  lastX = x;
  lastY = y;
};

const processScratchCanvas = ({
  radius,
  growth,
  minimum,
  ctx,
  color,
  opacity,
  tips
}) => {
  let targetLineWidth = radius * growth + minimum;
  ctx.strokeStyle = processColor(color, opacity);
  if (lastTips) {
    ctx.beginPath();
    Object.keys(tips).forEach((tip, tipIndex) => {
      ctx.moveTo(lastTips[tip].x, lastTips[tip].y);
      ctx.lineWidth = targetLineWidth - ctx.lineWidth + tipIndex;
      ctx.quadraticCurveTo(
        lastTips[tip].x,
        lastTips[tip].y,
        tips[tip].x,
        tips[tip].y
      );
      ctx.stroke();
    });
    ctx.lineJoin = "bevel";
  }
  lastTips = { ...tips };
};
