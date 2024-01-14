import defaultSetup from "../_setup.json";
import ControlGroup from "./ControlGroup";
import { saveSvg, saveJson } from "../utils";

const Menu = (props) => {
  const {
    setup,
    handleInputChange,
    mask,
  } = props;

  return (
    <>
      <nav
        id="mainNav"
        className={`menu menu--controls`}
      >
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={defaultSetup.filter(
            (control) => !control.isHidden && !control.isRight
          )}
        />
        <button
          className="control__input control__button control__button--save"
          onClick={() => {
            saveSvg();
          }}
        >
          Save SVG
        </button>
        <button
          className="control__input control__button control__button--save"
          onClick={() => {
            saveJson(mask);
          }}
        >
          Save mask
        </button>
        <button
          className="control__input control__button control__button--clear"
          onClick={() => {
            sessionStorage.clear();
            window.location.reload();
          }}
        >
          Reset
        </button>
      </nav>
    </>
  );
};

export default Menu;
