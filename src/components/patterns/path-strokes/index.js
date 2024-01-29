const pathStrokes = (props) => {
  const { pathStroke, thisPoint, controlPoint, radius, growth } = props;
  const strokeDefinitions = {
    lines: `L${thisPoint.x},${thisPoint.y} `,
    arcs: `A${radius * growth},${radius * growth} 1 0 1 ${thisPoint.x},${
      thisPoint.y
    }`,
    quadratics: `Q${controlPoint.x},${controlPoint.y} ${thisPoint.x},${thisPoint.y}`
  };
  return strokeDefinitions[pathStroke];
};

export default pathStrokes;