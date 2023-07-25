import React from 'react';
import Slider from '@mui/material/Slider';

const SliderInput = ({ value, min, max, step, onChange, name, sizeName, sizeSlider, sizeInput }) => {
  const handleSliderChange = (event, newValue) => {
    onChange(event, newValue);
  };

  const handleInputChange = (event) => {
    onChange(event, Number(event.target.value));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10px',
      }}
    >
      <span style={{ fontSize: '14px', flex: sizeName }}>{name}</span>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
        style={{ flex: sizeSlider }}
      />
      <input
        className="slider-input"
        type="number"
        value={value}
        onChange={handleInputChange}
        style={{ flex: sizeInput, textAlign: 'center', marginLeft: '5%', maxWidth: '15%' }}
      />
    </div>
  );
};

export default SliderInput;
