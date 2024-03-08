import {
  findClosestFacePointIndex,
  getDistance,
  checkElementPinch
} from "./index";
import { pinchCanvas } from './pinchCanvas';
import { scratchCanvas } from './scratchCanvas';

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
    hasCursorFingertips,
    scratchPattern
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
        lastTips = scratchCanvas({
          radius,
          growth,
          minimum,
          ctx,
          color,
          opacity,
          tips,
          scratchPattern,
          lastTips
        });
      } else {
        lastTips = undefined;
      }
      if (isPinched && !hasCursorFingertips) {
        let result = pinchCanvas({
          radius,
          thumbIndexDistance,
          growth,
          minimum,
          ctx,
          color,
          opacity,
          transitionArrangement,
          x,
          y,
          lastX,
          lastY
        });
        lastX = result.lastX;
        lastY = result.lastY;
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
