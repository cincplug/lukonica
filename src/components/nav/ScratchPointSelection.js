import DEFAULT_HAND_POINTS from "../../data/defaultScratchPoints.json";

function ScratchPointSelection({ scratchPoints, setScratchPoints }) {
  const handlePointClick = (index) => {
    if (scratchPoints.includes(index)) {
      setScratchPoints(scratchPoints.filter((point) => point !== index));
    } else {
      setScratchPoints([...scratchPoints, index]);
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="hand-selection"
      viewBox="0 0 500 500"
    >
      {DEFAULT_HAND_POINTS.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={20}
          onClick={() => handlePointClick(index)}
          className={`hand-point ${
            scratchPoints.includes(index) ? "selected" : "not-selected"
          }`}
        >
          {index}
        </circle>
      ))}
    </svg>
  );
}

export default ScratchPointSelection;
