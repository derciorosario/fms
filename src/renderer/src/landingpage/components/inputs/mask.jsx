import React, { useState } from 'react';
import InputMask from 'react-input-mask';
const NumberInput = ({form,setForm,className,field}) => {

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const formattedValue = value
      .replace(/\D/g, '     ') // Remove non-digit characters
      .replace(/(\d{1})(?=\d)/g, '$1 '); // Add space after every 4 digits
    setForm({...form,[field]:formattedValue})
  };

  return (
    <InputMask
      mask="9 9 9 9" // Adjust the mask as needed
      maskChar=" " // Character to use for spaces
      placeholder="____ ____ ____ ____" // Placeholder to show format
    >
      {(inputProps) => <input {...inputProps} type="text" />}
    </InputMask>
  );
};

export default NumberInput;
