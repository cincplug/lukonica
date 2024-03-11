import DEFAULT_SETUP from "../../_setup.json";
import ControlGroup from "./Controls";
import Buttons from "./Buttons";
import MaskSelection from "./MaskSelection";
import ScenarioSelection from "./ScenarioSelection";
import ScratchPointSelection from "./ScratchPointSelection";

const Menu = (props) => {
  const {
    setup,
    setSetup,
    handleInputChange,
    activeMask,
    setActiveMask,
    clearPaths
  } = props;
  const { showsFaces, pattern, hasCursorFingertips } = setup;

  return (
    <>
      <nav className={`menu menu--controls menu--stretched`}>
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={DEFAULT_SETUP.filter(
            (control) =>
              !control.isHidden &&
              !control.parentScenario &&
              (!control.parentPattern ||
                control.parentPattern.includes(pattern)) &&
              !control.isHandRelated &&
              !control.isFaceRelated
          )}
        />
        <br />
        <Buttons activeMask={activeMask} clearPaths={clearPaths} />
      </nav>
      <nav className={`menu menu--secondary`}>
        <ScenarioSelection {...{ setup, setSetup, handleInputChange }} />
        {!showsFaces && hasCursorFingertips && pattern === "canvas" && (
          <ScratchPointSelection {...{ setup, handleInputChange }} />
        )}
        <br />
        <ControlGroup
          {...{ setup, handleInputChange }}
          controls={DEFAULT_SETUP.filter(
            (control) =>
              !control.isHidden &&
              (!control.parentPattern ||
                control.parentPattern.includes(pattern)) &&
              ((control.isHandRelated && !showsFaces) ||
                (control.isFaceRelated && showsFaces))
          )}
        />
        {showsFaces && (
          <MaskSelection {...{ setActiveMask, setup, handleInputChange }} />
        )}
      </nav>
    </>
  );
};

export default Menu;
