const Info = (props) => {
  const { setup } = props;
  const { showsFaces, pattern, isScratchCanvas } = setup;
  return (
    <div className="info">
      {showsFaces && (
        <>
          <p>Face detection is ON.</p>
          {pattern === "paths" && (
            <>
              <p>Paths are drawn across selected face points.</p>
              <ul>
                <li>Select among Masks to change face points.</li>
                <li>
                  Change Radius, Arrangement and other properties for different
                  behaviour.
                </li>
              </ul>
            </>
          )}
          {pattern === "images" && (
            <>
              <p>Images are displayed across your selected face points.</p>
              <ul>
                <li>Select among Masks to change face points.</li>
                <li>
                  Use Radius, Growth and other properties to change behaviour.
                </li>
                <li>Use Image URL for different image.</li>
              </ul>
            </>
          )}
        </>
      )}
      {!showsFaces && (
        <>
          <p>
            Face detection is OFF, for better performance of hand detection.
          </p>
          {["paths", "hose", "kite", "canvas"].includes(pattern) &&
            !isScratchCanvas && (
              <ul>
                <li>
                  Pinch your thumb and forefinger like this 👌 and drag them to
                  draw.
                </li>
                <li>Release the pinch to stop drawing.</li>
                <li>
                  Wag your forefinger like this 👆 to delete what you drew.
                </li>
                {pattern !== "canvas" && (
                  <li>You can add text along the path.</li>
                )}
              </ul>
            )}
          {isScratchCanvas && (
            <ul>
              <li>Hold space bar to draw, release it to stop drawing.</li>
              <li>Choose finger points with which to draw, and the scratch pattern</li>
              <li>Use Pinch to scale your finger "brush"</li>
              <li>Wag your forefinger like this 👆 to delete what you drew.</li>
              <li>Use Dispersion and Dash for different feeling of the stroke.</li>
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Info;
