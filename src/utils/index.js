export const findClosestFacePointIndex = ({
  facePoints,
  indexTip,
  pinchThreshold
}) => {
  return facePoints.reduce(
    (closestFacePoint, currentFacePoint, currentIndex) => {
      const distance = getDistance(currentFacePoint, indexTip);
      if (
        distance < closestFacePoint.minDistance &&
        distance < pinchThreshold
      ) {
        return { minDistance: distance, index: currentIndex };
      } else {
        return closestFacePoint;
      }
    },
    { minDistance: Infinity, index: null }
  ).index;
};

export const getDistance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const squeezePoints = ({ points, squeezeRatio }) => {
  if (points.length === 0) {
    return null;
  }
  const center = points.reduce(
    (total, point, index, array) => {
      return {
        x: total.x + point.x / array.length,
        y: total.y + point.y / array.length
      };
    },
    { x: 0, y: 0 }
  );
  return points.map((point) => {
    return {
      x: center.x + ((point.x - center.x) * squeezeRatio) / 100,
      y: center.y + ((point.y - center.y) * squeezeRatio) / 100
    };
  });
};

export const processColor = (color, opacity) => {
  return `${color}${Math.min(255, Math.max(0, Math.round(opacity)))
    .toString(16)
    .padStart(2, "0")}`;
};

export const renderPath = ({ area, points, radius }) =>
  area
    .map((activeAreaPoint, activeAreaPointIndex) => {
      const thisPoint = points[activeAreaPoint];
      if (!thisPoint) return null;
      const lastPoint = points[area[activeAreaPointIndex - 1]];
      if (radius > 0 && lastPoint) {
        const deltaX = thisPoint.x - lastPoint.x;
        const deltaY = thisPoint.y - lastPoint.y;
        const h = Math.hypot(deltaX, deltaY) + radius;
        const controlPointX = lastPoint.x + deltaX / 2 + (radius * deltaY) / h;
        const controlPointY = lastPoint.y + deltaY / 2 - (radius * deltaX) / h;
        return `Q${controlPointX},${controlPointY} ${thisPoint.x},${thisPoint.y}`;
      } else {
        return `${activeAreaPointIndex === 0 ? "M" : "L"} ${thisPoint.x},${
          thisPoint.y
        }`;
      }
    })
    .join(" ");

export const saveJson = (areas) => {
  console.info(areas);
  const data = JSON.stringify(areas);
  fetch("/api/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data })
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
};

export const saveImage = () => {
  const link = document.createElement("a");
  const canvasElement = document.querySelector(".canvas");
  if (canvasElement) {
    link.download = "lukonica-canvas.png";
    link.setAttribute(
      "href",
      canvasElement
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
    );
    link.click();
  } else {
    link.download = "lukonica-scribble.svg";
    const svg = document.querySelector(".drawing");
    const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
    const e = new MouseEvent("click");
    link.href = "data:image/svg+xml;base64," + base64doc;
    link.dispatchEvent(e);
  }
};

export const checkElementPinch = ({ x, y, isPinched }) => {
  const element = document.elementFromPoint(x, y);
  if (!element) {
    return;
  }
  if (element.tagName === "BUTTON") {
    clearHighlight();
    element.classList.add("highlight");
    if (isPinched) {
      element.click();
      element.classList.remove("highlight");
    }
  } else {
    clearHighlight();
  }
};

const clearHighlight = () => {
  const highlightedElement = document.querySelector(".highlight");
  if (highlightedElement) {
    highlightedElement.classList.remove("highlight");
  }
};
