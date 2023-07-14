import React from 'react';
import Slider from '@mui/material/Slider';

const SliderInput = ({ value, min, max, step, onChange, name }) => {
  const handleSliderChange = (event, newValue) => {
    onChange(event, newValue);
  };

  const handleInputChange = (event) => {
    onChange(event, Number(event.target.value));
  };

  return (
    <div className="slider-input-container">
      <th>{name}</th>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
      />
      <input
        className="slider-input"
        type="number"
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SliderInput;
