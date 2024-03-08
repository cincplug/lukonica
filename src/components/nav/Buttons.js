import { saveSvg, saveJson } from "../../utils";

const Buttons = ({ activeMask, clearPaths }) => {
  return (
    <>
      <button
        className="control control--button"
        onClick={() => {
          saveSvg();
        }}
      >
        Save SVG
      </button>
      <button
        className="control control--button"
        onClick={() => {
          saveJson(activeMask);
        }}
      >
        Save mask
      </button>
      <button className="control control--button" onClick={clearPaths}>
        Clear
      </button>
      <button
        className="control control--button"
        onClick={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
      >
        Reset
      </button>
    </>
  );
};

export default Buttons;
