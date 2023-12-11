import Control from "./Control";

const ControlGroup = ({ controls, setup, handleInputChange }) =>
  controls.map((item, index) => (
    <Control
      {...{ item, index, setup, handleInputChange }}
      key={`m-${index}`}
    />
  ));

export default ControlGroup;
