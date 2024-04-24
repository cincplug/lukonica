const screenResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
const menuWidth = 260;
const { width, height } = screenResolution;
const board = {
  left: menuWidth,
  top: 0,
  width: width - 2 * menuWidth,
  height
};
const gridCol = board.width / 12;
const speed = 40;

const checkCollision = (ball, pathElement) => {
  let pathLength = pathElement.getTotalLength();
  let precision = 2;
  for (let i = 0; i < pathLength; i += precision) {
    let point = pathElement.getPointAtLength(i);
    let dx = point.x - ball.x;
    let dy = point.y - ball.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < ball.radius) {
      let normalAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return { collision: true, normalAngle: normalAngle };
    }
  }
  return { collision: false };
};

export const getBall = (prevState) => {
  const { x, y, angle } = prevState;
  let newX = x + speed * Math.cos((angle * Math.PI) / 180);
  let newY = y + speed * Math.sin((angle * Math.PI) / 180);
  let newAngle = angle;

  let pathElements = document.querySelectorAll(".mask-path");
  let collisionResult = { collision: false };

  pathElements.forEach((pathElement) => {
    let result = checkCollision({ x: newX, y: newY, radius: 20 }, pathElement);
    if (result.collision) {
      collisionResult = result;
    }
  });

  if (collisionResult.collision) {
    newAngle = 2 * collisionResult.normalAngle - angle;
  } else {
    const rectX = board.left;
    const rectY = board.top;
    const rectWidth = board.width;
    const rectHeight = board.height;
    if (newX < rectX || newX > rectX + rectWidth) {
      newAngle = 180 - newAngle;
    }
    if (newY < rectY || newY > rectY + rectHeight) {
      newAngle = 360 - newAngle;
    }
  }

  return {
    x: newX,
    y: newY,
    angle: newAngle
  };
};

const Ball = (props) => {
  const { setup, ball } = props;

  const boardStyleProps = {
    strokeWidth: setup.minimum / 2,
    stroke: setup.color,
    fill: "none"
  };

  return (
    ball.x && (
      <>
        <rect
          x={board.left}
          y={board.top}
          rx={setup.minimum * setup.radius}
          ry={setup.minimum * setup.radius}
          width={board.width}
          height={board.height}
          {...boardStyleProps}
        />
        <circle
          className="mask-path"
          cx={board.left + gridCol * 4}
          cy={ gridCol * 4}
          r={gridCol}
          {...boardStyleProps}
        ></circle>
        <circle
          className="mask-path"
          cx={board.left + gridCol * 8}
          cy={ gridCol * 4}
          r={gridCol}
          {...boardStyleProps}
        ></circle>
        <circle
          className="mask-path"
          cx={board.left + gridCol * 4}
          cy={board.height - gridCol * 4}
          r={gridCol}
          {...boardStyleProps}
        ></circle>
        <circle
          className="mask-path"
          cx={board.left + gridCol * 8}
          cy={board.height - gridCol * 4}
          r={gridCol}
          {...boardStyleProps}
        ></circle>

        <circle
          className="ball"
          cx={ball.x}
          cy={ball.y}
          r={setup.minimum}
        ></circle>
      </>
    )
  );
};

export default Ball;
