import React from "react";

const Cursor = ({ cursor, hasCursor, hasCursorFingertips }) => {
  return (
    <>
      {hasCursorFingertips && (
        <>
          <div
            className={`cursor cursor--fingertip`}
            style={{
              left: cursor.thumbTipX,
              top: cursor.thumbTipY,
            }}
          ></div>
          <div
            className={`cursor cursor--fingertip`}
            style={{
              left: cursor.indexTipX,
              top: cursor.indexTipY,
            }}
          ></div>
        </>
      )}
      {hasCursor && (
        <div
          className={`cursor cursor--${
            cursor.isPinched ? "active" : "inactive"
          }`}
          style={{ left: cursor.x, top: cursor.y }}
        ></div>
      )}
    </>
  );
};

export default Cursor;
