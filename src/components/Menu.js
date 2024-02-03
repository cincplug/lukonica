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
    setScribble,
    setPoints,
    setCustomMask,
    setCustomMaskNewArea,
  } = props;

  const handleClearButtonClick = () => {
    setScribble([]);
    setPoints([]);
    setCustomMask([]);
    setCustomMaskNewArea([]);
  };
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
        <fieldset className="control control--button">
          <button
            onClick={() => {
              saveSvg();
            }}
          >
            Save SVG
          </button>
        </fieldset>
        <fieldset className="control control--button">
          <button
            onClick={() => {
              saveJson(activeMask);
            }}
          >
            Save mask
          </button>
        </fieldset>
        <fieldset className="control control--button">
          <button
            onClick={handleClearButtonClick}
          >
            Clear
          </button>
        </fieldset>
        <fieldset className="control control--button">
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
          >
            Reset
          </button>
        </fieldset>
      </nav>
      <MaskSelection {...{ setActiveMask, setup, setSetup, handleInputChange }} />
    </>
  );
};

export default Menu;
