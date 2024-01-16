import React, { useEffect, useState } from "react";
import defaultFacePoints from "../default-face-points.json";
import masks from "../masks/masks.json";
import { renderPath } from "../utils";

const PatternGroup = (props) => {
  const { isLoaded, setMask } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/fetch")
      .then((response) => response.json())
      .then((jsons) => {
        const data = jsons.map((json) => JSON.parse(json.data));
        if (data) {
          setData(masks.concat(data));
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handlePatternClick = (_event, pattern) => {
    setMask(pattern);
  };

  return (
    data &&
    isLoaded && (
      <nav id="mainNav" className={`menu menu--patterns`}>
        {data.map((pattern, index) => (
          <button
            className="menu__pattern__button"
            onClick={(event) => handlePatternClick(event, pattern)}
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
