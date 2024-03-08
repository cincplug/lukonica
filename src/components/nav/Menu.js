import DEFAULT_SETUP from "../../_setup.json";
import ControlGroup from "./Controls";
import Buttons from "./Buttons";
import MaskSelection from "./MaskSelection";
import ScenarioSelection from "./ScenarioSelection";
import HandPointSelection from "./HandPointSelection";

const Menu = (props) => {
  const {
    setup,
    setSetup,
    handleInputChange,
    activeMask,
    setActiveMask,
    clearPaths
  } = props;
  const { showsFaces, pattern } = setup;

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
        <Buttons activeMask={activeMask} clearPaths={clearPaths} />
      </nav>
      <nav className={`menu menu--secondary`}>
        <ScenarioSelection {...{ setup, setSetup, handleInputChange }} />
        {!showsFaces && pattern === "canvas" && <HandPointSelection />}
        {showsFaces && (
          <MaskSelection {...{ setActiveMask, setup, handleInputChange }} />
        )}
      </nav>
    </>
  );
};

export default Menu;
