import React from "react";
import { InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";
// Local
import { states } from "../../assets/data/us_states";

const menuItems = states.map(state => (
  <MenuItem key={state.abbr} value={state.abbr}>
    {state.abbr} &middot; {state.name}
  </MenuItem>
));

/**
 * @typedef {import("@material-ui/core").SelectProps} SelectProps
 *
 * @typedef {object} SelectStateUSProps
 * @property {string} [label]
 *
 * @param {SelectProps & SelectStateUSProps} props
 */
function _SelectStateUS({
  displayEmpty,
  children,
  className,
  label = "State",
  name = "state",
  onChange,
  value,
  ...props
}) {
  const id = `${name}-label-placeholder`;
  return (
    <FormControl className={className}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        displayEmpty={displayEmpty}
        value={value}
        onChange={onChange}
        inputProps={{
          id,
          name,
        }}
        name={name}
        {...props}
      >
        {displayEmpty && <MenuItem value="">&nbsp;</MenuItem>}
        {menuItems}
      </Select>
      {children}
    </FormControl>
  );
}

export const SelectStateUS = React.memo(_SelectStateUS);
