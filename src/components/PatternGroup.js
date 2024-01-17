import React, { useEffect, useState } from "react";
import defaultFacePoints from "../default-face-points.json";
import masks from "../masks/masks.json";
import { renderPath } from "../utils";

const PatternGroup = (props) => {
  const { setMask, setup, handleInputChange } = props;
  const [data, setData] = useState(masks);

  useEffect(() => {
    fetch("/api/fetch")
      .then((response) => response.json())
      .then((jsons) => {
        const data = jsons.map((json) => JSON.parse(json.data));
        if (data) {
          setData((prevData) => prevData.concat(data));
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
    setMask(pattern);
  };

  return (
    data && (
      <nav id="mainNav" className={`menu menu--patterns`}>
        {data.map((pattern, index) => (
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
