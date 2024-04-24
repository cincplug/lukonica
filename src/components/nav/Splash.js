import { ReactComponent as Logo } from "../../assets/img/lukonica-logo.svg";

const Splash = (props) => {
  const { handlePlayButtonClick } = props;
  return (
    <div className="wrap splash">
      <h1>Lukonica</h1>
      <button
        className="splash-button"
        title="Start the app"
        onClick={handlePlayButtonClick}
      >
        <Logo />
        Start camera
      </button>
      <div className="buttons">
        <p>Looking for those painting features based on hand gestures?</p>
        <p>
          They are migrated to <a href="https://machevuoi.vercel.app/">Ma che vuoi 🤌</a>
        </p>
      </div>
    </div>
  );
};

export default Splash;
