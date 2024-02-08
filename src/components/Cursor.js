import React from "react";

const Cursor = (props) => {
  const { cursor, hasCursorFingertips } = props;
  const { x, y, wrist, thumbTip, indexTip, middleDip, isPinched, isWagging } =
    cursor;
  return (
    <>
      {hasCursorFingertips && thumbTip && (
        <>
          <div
            className={`cursor cursor--fingertip`}
            style={{
              left: thumbTip?.x,
              top: thumbTip?.y
            }}
          ></div>
          <div
            className={`cursor cursor--fingertip`}
            style={{
              left: indexTip?.x,
              top: indexTip?.y
            }}
          ></div>
          <div
            className={`cursor cursor--fingertip`}
            style={{
              left: middleDip?.x,
              top: middleDip?.y
            }}
          ></div>
          <div
            className={`cursor cursor--fingertip`}
            style={{
              left: wrist?.x,
              top: wrist?.y
            }}
          ></div>
        </>
      )}
      {x && (
        <div
          className={`cursor cursor--${
            isPinched ? "active" : "inactive"
          } cursor--${isWagging ? "wagging" : "not-wagging"}`}
          style={{ left: x, top: y }}
        ></div>
      )}
    </>
  );
};

export default Cursor;
