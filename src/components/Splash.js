const Splash = (props) => {
  const { setIsEditing, handlePlayButtonClick } = props;
  return (
    <div className="wrap splash">
      <button
        className="splash-button"
        onClick={() => {
          setIsEditing(true);
        }}
      >
        Create mask
      </button>
      <button
        className="splash-button video-button play-button"
        onClick={handlePlayButtonClick}
      >
        Start video
      </button>
    </div>
  );
};
export default Splash;
