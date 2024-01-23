import React, { useRef } from "react";
import Path from "./Path";

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
