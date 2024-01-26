import DEFAULT_SETUP from "../_setup.json";
import ControlGroup from "./ControlGroup";
import MaskSelection from "./MaskSelection";
import { saveSvg, saveJson } from "../utils";

const Menu = (props) => {
  const { setup, handleInputChange, activeMask, setActiveMask } = props;
  return (
    <>
      <nav className={`menu menu--controls menu--stretched`}>
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={DEFAULT_SETUP.filter(
            (control) => !control.isHidden && !control.isRight
          )}
        />
        <fieldset className="control control--button">
          <button
            className=""
            onClick={() => {
              saveSvg();
            }}
          >
            Save SVG
          </button>
        </fieldset>
        <fieldset className="control control--button">
          <button
            className=""
            onClick={() => {
              saveJson(activeMask);
            }}
          >
            Save mask
          </button>
        </fieldset>
        <fieldset className="control control--button">
          <button
            className=""
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
          >
            Reset
          </button>
        </fieldset>
      </nav>
      <MaskSelection {...{ setActiveMask, setup, handleInputChange }} />
    </>
  );
};

export default Menu;
