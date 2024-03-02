import { ReactComponent as Logo } from "../assets/lukonica-logo.svg";

const Splash = (props) => {
  const { setIsEditing, handlePlayButtonClick } = props;
  return (
    <div className="wrap splash">
      <h1>Lukonica</h1>
      <button className="splash-button" onClick={handlePlayButtonClick}>
        <Logo />
        Start camera
      </button>
      <div className="buttons">
        <button
          className="splash-button"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Create mask
        </button>
      </div>
    </div>
  );
};

export default Splash;
