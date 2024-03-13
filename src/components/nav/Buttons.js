import { saveImage, saveJson } from "../../utils";

const Buttons = ({ activeMask, clearPaths }) => {
  return (
    <>
      <button
        className="control control--button"
        onClick={() => {
          saveImage();
        }}
      >
        Save image
      </button>
      {activeMask && (
        <button
          className="control control--button"
          onClick={() => {
            saveJson(activeMask);
          }}
        >
          Save mask
        </button>
      )}
      <button className="control control--button" onClick={clearPaths}>
        Clear image
      </button>
      <button
        className="control control--button"
        onClick={() => {
          sessionStorage.clear();
          window.location = "/";
        }}
      >
        Reset all
      </button>
    </>
  );
};

export default Buttons;
