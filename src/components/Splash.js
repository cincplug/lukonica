import React from "react";

function Splash(props) {
  const { setIsStarted, setSetup, setIsEditing } = props;
  return (
    <div className="splash">
      <button
        onClick={() => {
          setIsStarted(true);
          setSetup((prevSetup) => {
            return { ...prevSetup, showsFaces: true, showsHands: false };
          });
        }}
      >
        Face only
      </button>
      <button
        onClick={() => {
          setIsStarted(true);
          setSetup((prevSetup) => {
            return { ...prevSetup, showsFaces: true, showsHands: true };
          });
        }}
      >
        Face and hand
      </button>
      <button
        className="control__input control__button control__button--clear"
        onClick={() => {
          setIsEditing(true);
        }}
      >
        Area editor
      </button>
    </div>
  );
}

export default Splash;
