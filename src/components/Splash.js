import logo from "../assets/lukonica-logo.svg";
const Splash = (props) => {
  const { setIsEditing, handlePlayButtonClick } = props;
  return (
    <div className="wrap splash">
      <h1>Lukonica</h1>
      <button onClick={handlePlayButtonClick}>
        <img src={logo} alt="logo" />
        <h2>Start camera</h2>
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
