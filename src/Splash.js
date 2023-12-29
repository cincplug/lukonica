import React from "react";
import "./App.scss";

function Splash(props) {
  const { setIsStarted, setSetup, setIsEditing } = props;
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
        Faces and hands
      </button>
      <button
        className="control__input control__button control__button--clear"
        onClick={() => {
          setIsEditing(true);
        }}
      >
        Face editor
      </button>
    </div>
  );
}

export default Splash;
