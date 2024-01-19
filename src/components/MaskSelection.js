import React, { useEffect, useState } from "react";
import defaultFacePoints from "../data/defaultFacePoints.json";
import defaultMasks from "../data/defaultMasks.json";
import { renderPath } from "../utils";

const MaskSelection = (props) => {
  const { setActiveMask, setup, handleInputChange } = props;
  const { activeMaskIndex } = setup;
  const [masks, setMasks] = useState(defaultMasks);

  useEffect(() => {
    fetch("/api/fetch")
      .then((response) => response.json())
      .then((responseJson) => {
        const parsedResponse = responseJson.map((json) =>
          JSON.parse(json.data)
        );
        setMasks(
          parsedResponse ? defaultMasks.concat(parsedResponse) : defaultMasks
        );
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    setActiveMask((masks || defaultMasks)[activeMaskIndex]);
  }, [masks, setActiveMask, activeMaskIndex]);

  const handlePatternClick = (_event, mask, index) => {
    handleInputChange({
      target: {
        id: "activeMaskIndex",
        value: index,
        type: "range"
      }
    });
    setActiveMask(mask);
  };

  return (
    (masks || defaultMasks) && (
      <nav id="mainNav" className={`menu menu--patterns`}>
        {masks.map((mask, index) => (
          <button
            className={`menu__pattern__button menu__pattern__button--${
              activeMaskIndex === index ? "active" : "inactive"
            }`}
            onClick={(event) => handlePatternClick(event, mask, index)}
            key={`p-${index}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`200 0 800 700`}
              className="menu__pattern__svg"
            >
              {mask.map((path, pathIndex) => (
                <path
                  key={`pth-${pathIndex}`}
                  className="menu__pattern__path"
                  d={`${renderPath({
                    area: path,
                    points: defaultFacePoints,
                    radius: 0
                  })}`}
                ></path>
              ))}
            </svg>
          </button>
        ))}
      </nav>
    )
  );
};

export default MaskSelection;
