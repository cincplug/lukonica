// import { TRIANGULATION } from "./triangulation";

// const tekst = "maxFaces: Defaults to 1. The maximum number of faces that will be detected by the model. The number of returned faces can be less than the maximum (for example when no faces are present in the input). It is highly recommended to set this value to the expected max number of faces, otherwise the model will continue to search for the missing faces which can slow down the performance.";

// const colors = [
//   "#1a0a33",
//   "#220b4e",
//   "#2a0c68",
//   "#310e82",
//   "#39119d",
//   "#4112b8",
//   "#4813d2",
//   "#5014ed",
//   "#5816ff",
//   "#7262ff",
//   "#8c9bff",
//   "#a7baff",
//   "#c2d3ff",
//   "#dce4ff",
// ];

export const drawMesh = (prediction) => {
  if (!prediction) return;
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;
  // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // for (let i = 0; i < TRIANGULATION.length / 3; i++) {
  //   const points = [
  //     TRIANGULATION[i * 3],
  //     TRIANGULATION[i * 3 + 1],
  //     TRIANGULATION[i * 3 + 2],
  //   ].map((index) => keyPoints[index]);
  //   drawPath(ctx, points, true);
  // }

  // ctx.fillStyle = "#00808040";
  // keyPoints.forEach((point, index) => {
  //   if (index % 2 !== 0) return;
  //   ctx.fillStyle =
  //     colors[Math.floor((colors.length * index) / keyPoints.length)] + "40";
  //   ctx.font = `${point.z / 2 + 20}px Arial`;
  //   ctx.fillText(tekst.slice(index, index + 5), point.x, point.y);
  // });

  // for (let keyPoint of keyPoints) {
  //   ctx.beginPath();
  //   ctx.arc(
  //     keyPoint.x,
  //     keyPoint.y,
  //     keyPoints.indexOf(keyPoint) / 5,
  //     0,
  //     3 * Math.PI
  //   );
  //   ctx.fillStyle = "#00438008";
  //   ctx.fill();
  // }

  // ctx.beginPath();
  // ctx.moveTo(keyPoints[0].x, keyPoints[0].y)
  // for (let keyPoint of keyPoints) {
  //   ctx.lineTo(keyPoint.x, keyPoint.y);
  // }
  // ctx.closePath();
  // ctx.fillStyle = "#00438018";
  // ctx.fill();

  return keyPoints;
};

// const drawPath = (ctx, points, closePath) => {
//   const region = new Path2D();
//   region.moveTo(points[0].x, points[0].y);
//   for (let i = 1; i < points.length; i++) {
//     const point = points[i];
//     region.lineTo(point.x, point.y);
//     ctx.fillStyle = ctx.fillStyle = colors[Math.floor(point.z / 10)];
//     ctx.fill(region);
//   }
//   if (closePath) region.closePath();
//   ctx.strokeStyle = "white";
//   ctx.stroke(region);
// };
