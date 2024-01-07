const Control = ({ item, index, setup, handleInputChange }) => {
  const { id, type, min, max, step, description, options } = item;
  const label = id.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  let value = setup[id] || "";
  const checked = value === true;
  return (
    <fieldset
      className={`control control--${type} control--${id}`}
      key={`${id}-${index}`}
      title={description}
    >
      {type === "select" ? (
        <select
          className="control__select"
          {...{value, id}}
          onChange={(event) => {
            handleInputChange(event);
          }}
        >
          {options.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="control__input"
          {...{ type, id, value, min, max, step, checked }}
          onChange={(event) => {
            handleInputChange(event);
          }}
        />
      )}
      <label className="control__label" htmlFor={id}>
        <span>{label}</span>
        {type === "range" && <span>{value}</span>}
      </label>
    </fieldset>
  );
};

export default Control;
