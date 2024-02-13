import React, { useEffect, useState } from "react";
import DEFAULT_FACE_POINTS from "../data/defaultFacePoints.json";
import DEFAULT_MASKS from "../data/defaultMasks.json";
import scenarios from "../data/scenarios.json";
import { renderPath } from "../utils";

const MaskSelection = (props) => {
  const { setActiveMask, setup, setSetup, handleInputChange } = props;
  const { activeMaskIndex } = setup;
  const [masks, setMasks] = useState(DEFAULT_MASKS);

  const fetchMoreMasks = () => {
    fetch("/api/fetch")
      .then((response) => response.json())
      .then((responseJson) => {
        const parsedResponse = responseJson.map((json) =>
          JSON.parse(json.data)
        );
        setMasks(
          parsedResponse ? DEFAULT_MASKS.concat(parsedResponse) : DEFAULT_MASKS
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    setActiveMask(
      (masks || DEFAULT_MASKS)[activeMaskIndex] || DEFAULT_MASKS[0]
    );
  }, [masks, setActiveMask, activeMaskIndex]);

  const handleMaskButtonClick = (_event, mask, index) => {
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
    (masks || DEFAULT_MASKS) && (
      <nav className={`menu menu--secondary`}>
        <fieldset className="menu--masks">
          <legend>Masks</legend>
          {masks.map((mask, index) => (
            <button
              className={`menu--masks__button ${activeMaskIndex === index ? "active" : "inactive"}`}
              onClick={(event) => handleMaskButtonClick(event, mask, index)}
              key={`p-${index}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox={`150 0 800 680`}>
                {mask.map((path, pathIndex) => (
                  <path
                    key={`pth-${pathIndex}`}
                    d={`${renderPath({
                      area: path,
                      points: DEFAULT_FACE_POINTS,
                      radius: 0
                    })}`}
                  ></path>
                ))}
              </svg>
            </button>
          ))}
          <button className="menu--masks__button" onClick={fetchMoreMasks} key={`p-more`}>
            More
          </button>
        </fieldset>
        <fieldset className="menu--scenarios">
          <legend>Scenarios</legend>
          {Object.keys(scenarios).map((scenario, index) => (
            <button
              className="control control--button"
              key={`scn-${index}`}
              onClick={() =>
                setSetup((prevSetup) => {
                  const newScenario = scenarios[scenario];
                  return { ...prevSetup, ...newScenario };
                })
              }
            >
              {scenario}
            </button>
          ))}
        </fieldset>
      </nav>
    )
  );
};

export default MaskSelection;
