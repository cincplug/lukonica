import React from "react";

const Cursor = (props) => {
  const { cursor, hasCursorFingertips } = props;
  const { x, y, thumbTip, indexTip, middleTip, isPinched } = cursor;
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
        </>
      )}
      {x && (
        <div
          className={`cursor cursor--${isPinched ? "active" : "inactive"}`}
          style={{ left: x, top: y }}
        ></div>
      )}
    </>
  );
};

export default Cursor;
