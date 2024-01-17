import React, { useEffect, useState } from "react";
import defaultFacePoints from "../data/defaultFacePoints.json";
import defaultMasks from "../data/defaultMasks.json";
import { renderPath } from "../utils";

const PatternGroup = (props) => {
  const { setActiveMask, setup, handleInputChange } = props;
  const [masks, setMasks] = useState(defaultMasks);

  useEffect(() => {
    fetch("/api/fetch")
      .then((response) => response.json())
      .then((responseJson) => {
        const parsedResponse = responseJson.map((json) =>
          JSON.parse(json.data)
        );
        if (parsedResponse) {
          setMasks((prevData) => prevData.concat(parsedResponse));
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handlePatternClick = (_event, pattern, index) => {
    handleInputChange({
      target: {
        id: "activeMaskIndex",
        value: index,
        type: "range"
      }
    });
    setActiveMask(pattern);
  };

  return (
    masks && (
      <nav id="mainNav" className={`menu menu--patterns`}>
        {masks.map((pattern, index) => (
          <button
            className={`menu__pattern__button menu__pattern__button--${
              setup.activeMaskIndex === index ? "active" : "inactive"
            }`}
            onClick={(event) => handlePatternClick(event, pattern, index)}
            key={`p-${index}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`200 0 800 700`}
              className="menu__pattern__svg"
            >
              {pattern.map((path, pathIndex) => (
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

export default PatternGroup;
