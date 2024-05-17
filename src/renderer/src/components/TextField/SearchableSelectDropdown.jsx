import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const SearchableSelectDropdown = ({ options, label, value, onChange }) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      renderInput={(params) => <TextField {...params} label={label} />}
      getOptionLabel={(option) => option.label}
    />
  );
};

export default SearchableSelectDropdown;
