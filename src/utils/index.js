export const findClosestFacePointIndex = ({ facePoints, indexTip, threshold }) => {
  return facePoints.reduce(
    (closestFacePoint, currentFacePoint, currentIndex) => {
      const distance = getDistance(currentFacePoint, indexTip);
      if (distance < closestFacePoint.minDistance && distance < threshold) {
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

export const processColor = (color, opacity) => {
  return `${color}${Math.min(255, Math.max(16, opacity))
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
        const controlPointX =
          lastPoint.x +
          deltaX / 2 +
          (radius * deltaY) / Math.hypot(deltaX, deltaY);
        const controlPointY =
          lastPoint.y +
          deltaY / 2 -
          (radius * deltaX) / Math.hypot(deltaX, deltaY);
        return `Q${controlPointX},${controlPointY} ${thisPoint.x},${thisPoint.y}`;
      } else {
        return `${activeAreaPointIndex === 0 ? "M" : "L"} ${thisPoint.x},${
          thisPoint.y
        }`;
      }
    })
    .join(" ");

export const saveJson = (areas) => {
  const data = JSON.stringify(areas);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "areas.json";
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const saveSvg = () => {
  const link = document.createElement("a");
  link.download = "download.svg";
  const svg = document.querySelector(".drawing");
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const e = new MouseEvent("click");
  link.href = "data:image/svg+xml;base64," + base64doc;
  link.dispatchEvent(e);
};