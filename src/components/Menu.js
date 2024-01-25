import DEFAULT_SETUP from "../_setup.json";
import ControlGroup from "./ControlGroup";
import MaskSelection from "./MaskSelection";
import { saveSvg, saveJson } from "../utils";

const Menu = (props) => {
  const { setup, handleInputChange, activeMask, setActiveMask } = props;
  return (
    <>
      <nav id="mainNav" className={`menu menu--controls`}>
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={DEFAULT_SETUP.filter(
            (control) => !control.isHidden && !control.isRight
          )}
        />
        <fieldset className="control control--button">
          <button
            className="menu__button"
            onClick={() => {
              saveSvg();
            }}
          >
            Save SVG
          </button>
        </fieldset>
        <fieldset className="control control--button">
          <button
            className="menu__button"
            onClick={() => {
              saveJson(activeMask);
            }}
          >
            Save mask
          </button>
        </fieldset>
        <fieldset className="control control--button">
          <button
            className="menu__button"
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
