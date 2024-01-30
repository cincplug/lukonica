import React, { useRef } from "react";
import Path from "./Path";

const Paths = ({ points, activeMask, setup, customFaceAreas, activeCustomFaceArea }) => {
  const { transitionArrangement } = setup;
  const maskRefs = useRef(activeMask.map(() => React.createRef()));
  const customFaceAreaRefs = useRef(customFaceAreas.map(() => React.createRef()));
  const activeCustomFaceAreaRef = useRef(null);
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
      {customFaceAreas &&
        customFaceAreas.map((customFaceArea, customFaceAreaIndex) => (
          <Path
            key={`ch-${customFaceAreaIndex}`}
            area={customFaceArea}
            className="mask-path mask-path--customFaceArea"
            pathRef={customFaceAreaRefs.current[customFaceAreaIndex]}
            {...commonProps}
          />
        ))}
      {activeCustomFaceArea && (
        <Path
          area={activeCustomFaceArea}
          className="mask-path mask-path--customFaceArea mask-path--customFaceArea--active"
          pathRef={activeCustomFaceAreaRef}
          {...commonProps}
        />
      )}
    </>
  );
};

export default Paths;
