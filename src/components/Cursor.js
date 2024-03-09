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

  const pinchClass = isPinched ? "active" : "inactive";
  const wagClass = isWagging ? "wagging" : "not-wagging";
  return (
    <>
      {hasCursorFingertips && thumbTip && (
        <>
          <div
            className={`cursor fingertip`}
            style={{
              left: thumbTip?.x,
              top: thumbTip?.y
            }}
          ></div>
          <div
            className={`cursor fingertip ${wagClass}`}
            style={{
              left: indexTip?.x,
              top: indexTip?.y
            }}
          ></div>
          <div
            className={`cursor fingertip`}
            style={{
              left: middleTip?.x,
              top: middleTip?.y
            }}
          ></div>
          <div
            className={`cursor fingertip`}
            style={{
              left: ringyTip?.x,
              top: ringyTip?.y
            }}
          ></div>
          <div
            className={`cursor fingertip`}
            style={{
              left: pinkyTip?.x,
              top: pinkyTip?.y
            }}
          ></div>
        </>
      )}
      {hasCursor && x > 0 && (
        <div
          className={`cursor ${pinchClass} ${wagClass}`}
          style={{ left: x, top: y }}
        ></div>
      )}
    </>
  );
};

export default Cursor;
