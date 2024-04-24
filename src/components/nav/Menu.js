import DEFAULT_SETUP from "../../_setup.json";
import ControlGroup from "./Controls";
import Buttons from "./Buttons";
// import Info from "./Info";
import MaskSelection from "./MaskSelection";
import ScenarioSelection from "./ScenarioSelection";

const Menu = (props) => {
  const {
    setup,
    setSetup,
    handleInputChange,
    activeMask,
    setActiveMask,
    clearPaths,
    setIsEditing
  } = props;
  const { pattern } = setup;
  return (
    <>
      <nav className={`menu menu--controls`}>
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={DEFAULT_SETUP.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentPattern ||
                control.parentPattern.includes(pattern))
          )}
        />
        <Buttons {...{ activeMask, clearPaths, setActiveMask, setIsEditing }} />
        {/* <Info {...{ setup }} /> */}
      </nav>
      <nav className={`menu menu--secondary`}>
        <ScenarioSelection {...{ setup, setSetup, handleInputChange }} />
        <MaskSelection {...{ setActiveMask, setup, handleInputChange }} />
      </nav>
    </>
  );
};

export default Menu;
