import React, { useEffect, useRef } from "react";
import { processColor, renderPath } from "../../utils";

const Path = ({ area, points, className, pathRef, setup, ...commonProps }) => {
  const {
    radius,
    transitionDuration,
    usesCssAnimation,
    usesSvgAnimation,
    transitionArrangement
  } = setup;

  useEffect(() => {
    if (usesCssAnimation && pathRef && pathRef.current) {
      if (area && points && radius) {
        const newPath = renderPath({ area, points, radius });
        pathRef.current.setAttribute("d", newPath);
      }
    }
  }, [area, pathRef, points, radius, usesCssAnimation]);

  return (
    <path
      ref={pathRef}
      className={className}
      fill={processColor(setup.color, setup.opacity)}
      d={
        area && points && radius
          ? `${renderPath({ area, points, radius })} Z`
          : ""
      }
      style={
        usesCssAnimation
          ? { transition: `d ${transitionDuration}s linear` }
          : null
      }
      {...commonProps}
    >
      {transitionArrangement && usesSvgAnimation && (
        <animate
          attributeName="d"
          values={`${renderPath({
            area,
            points,
            radius
          })} Z;${renderPath({
            area: [
              ...area.slice(transitionArrangement),
              ...area.slice(0, transitionArrangement)
            ],
            points,
            radius
          })} Z`}
          keyTimes="0;1"
          dur={`${setup.transitionDuration}s`}
          repeatCount="indefinite"
        />
      )}
    </path>
  );
};

const Paths = ({ points, activeMask, setup, chunks, activeChunk, cursor }) => {
  const { transitionArrangement } = setup;
  const maskRefs = useRef(activeMask.map(() => React.createRef()));
  const chunkRefs = useRef(chunks.map(() => React.createRef()));
  const activeChunkRef = useRef(null);
  const commonProps = {
    setup,
    points
  };

  return (
    <>
      {activeMask.map((area, areaIndex) => (
        <Path
          key={`m-${areaIndex}`}
          area={[
            ...area.slice(transitionArrangement),
            ...area.slice(0, transitionArrangement)
          ]}
          className="mask-path mask-path--default"
          pathRef={maskRefs.current[areaIndex]}
          {...commonProps}
        />
      ))}
      {chunks &&
        chunks.map((chunk, chunkIndex) => (
          <Path
            key={`ch-${chunkIndex}`}
            area={chunk}
            className="mask-path mask-path--chunk"
            pathRef={chunkRefs.current[chunkIndex]}
            {...commonProps}
          />
        ))}
      {activeChunk && (
        <Path
          area={activeChunk}
          className="mask-path mask-path--chunk mask-path--chunk--active"
          pathRef={activeChunkRef}
          {...commonProps}
        />
      )}
      <circle
        className={`cursor cursor--${cursor.isActive ? "active" : "inactive"}`}
        r={6}
        cx={cursor.x}
        cy={cursor.y}
      ></circle>
    </>
  );
};

export default Paths;
