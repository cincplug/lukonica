import React, { useEffect, useState } from "react";
import defaultFacePoints from "../default-face-points.json";
// import mask from "../masks/luka.json";
// import mask2 from "../masks/luka2.json";
// import mask3 from "../masks/outer.json";
import { renderPath } from "../utils";

const PatternGroup = (props) => {
  const [data, setData] = useState(null);

    useEffect(() => {
      fetch("/api/fetch")
        .then((response) => response.json())
        .then((jsons) => setData(jsons))
        .catch((error) => console.error("Error:", error));
    }, []);

  return (
    data &&
    data.map((pattern, index) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 1500 1000`}
        className="pattern"
        key={`p-${index}`}
      >
        {pattern.map((path, pathIndex) => (
          <path
            key={`pth-${pathIndex}`}
            className="pattern__item"
            d={`${renderPath({
              area: path,
              points: defaultFacePoints,
              radius: 0
            })}`}
          ></path>
        ))}
      </svg>
    ))
  );
};

export default PatternGroup;
