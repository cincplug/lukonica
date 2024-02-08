import DEFAULT_SETUP from "../_setup.json";
import ControlGroup from "./ControlGroup";
import MaskSelection from "./MaskSelection";
import { saveSvg, saveJson } from "../utils";

const Menu = (props) => {
  const {
    setup,
    setSetup,
    handleInputChange,
    activeMask,
    setActiveMask,
    clearPaths
  } = props;

  return (
    <>
      <nav className={`menu menu--controls menu--stretched`}>
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={DEFAULT_SETUP.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentPattern ||
                control.parentPattern === setup.pattern)
          )}
        />
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
      </nav>
      <MaskSelection
        {...{ setActiveMask, setup, setSetup, handleInputChange }}
      />
    </>
  );
};

export default Menu;
