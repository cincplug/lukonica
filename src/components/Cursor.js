import React from "react";

const Cursor = (props) => {
  const { cursor, hasCursor, hasCursorFingertips } = props;
  const {
    x,
    y,
    thumbTip,
    indexTip,
    middleTip,
    ringyTip,
    pinkyTip,
    isPinched,
    isWagging
  } = cursor;
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
              left: middleTip?.x,
              top: middleTip?.y
            }}
          ></div>
          <div
            className={`cursor cursor--fingertip`}
            style={{
              left: ringyTip?.x,
              top: ringyTip?.y
            }}
          ></div>
          <div
            className={`cursor cursor--fingertip`}
            style={{
              left: pinkyTip?.x,
              top: pinkyTip?.y
            }}
          ></div>
        </>
      )}
      {hasCursor && x > 0 && (
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
