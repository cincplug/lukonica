import defaultSetup from "./_setup.json";
import ControlGroup from "./ControlGroup";
// import { download } from "./utils";

const Menu = (props) => {
  const {
    setup,
    handleInputChange,
    setIsEditing,
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
        {/* <button
          className="control__input control__button control__button--save"
          onClick={() => {
            download();
          }}
        >
          Save
        </button> */}
        <button
          className="control__input control__button control__button--clear"
          onClick={() => {
            sessionStorage.clear();
            window.location.reload();
          }}
        >
          Reset
        </button>
        <button
          className="control__input control__button control__button--clear"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Face editor
        </button>
      </nav>
    </>
  );
};

export default Menu;
