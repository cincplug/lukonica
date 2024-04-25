import { ReactComponent as Logo } from "../../assets/img/lukonica-logo.svg";

const Splash = (props) => {
  const { handlePlayButtonClick } = props;
  return (
    <div className="wrap splash">
      <div className="buttons">
        <h1>Lukonica</h1>
        <p>
          Exploring utilization of face features detection<br/>
          in industries like cosmetics and accessories retail
        </p>
      </div>
      <button
        className="splash-button"
        title="Start the app"
        onClick={handlePlayButtonClick}
      >
        <Logo />
        Start camera
      </button>
      <div className="buttons">
        <p>Looking for painting features based on hand gestures?</p>
        <p>
          That's migrated to{" "}
          <a href="https://machevuoi.vercel.app/">Ma che vuoi 🤌</a>
        </p>
      </div>
    </div>
  );
};

export default Splash;
