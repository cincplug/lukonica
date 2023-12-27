import React from "react";
import "./App.scss";

function Splash(props) {
  const { setIsStarted, setSetup } = props;
  return (
    <div className="splash">
      <button
        onClick={() => {
          setIsStarted(true);
          setSetup((prevSetup) => {
            return { ...prevSetup, showsFaces: true };
          });
        }}
      >
        Faces
      </button>
      <button
        onClick={() => {
          setIsStarted(true);
          setSetup((prevSetup) => {
            return { ...prevSetup, showsHands: true };
          });
        }}
      >
        Hands
      </button>
      <button
        onClick={() => {
          setIsStarted(true);
          setSetup((prevSetup) => {
            return { ...prevSetup, showsFaces: true, showsHands: true };
          });
        }}
      >
        Both
      </button>
    </div>
  );
}

export default Splash;
