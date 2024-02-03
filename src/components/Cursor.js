import React from "react";

const Cursor = ({ cursor, hasCursor, hasCursorFingertips }) => {
  return (
    <>
      {hasCursorFingertips && (
        <>
          <circle
            className={`cursor cursor--${
              cursor.isPinched ? "active" : "inactive"
            }`}
            r={2}
            cx={cursor.thumbTipX}
            cy={cursor.thumbTipY}
          ></circle>
          <circle
            className={`cursor cursor--${
              cursor.isPinched ? "active" : "inactive"
            }`}
            r={2}
            cx={cursor.indexTipX}
            cy={cursor.indexTipY}
          ></circle>
        </>
      )}
      {hasCursor && (
        <circle
          className={`cursor cursor--${
            cursor.isPinched ? "active" : "inactive"
          }`}
          r={6}
          cx={cursor.x}
          cy={cursor.y}
        ></circle>
      )}
    </>
  );
};

export default Cursor;
