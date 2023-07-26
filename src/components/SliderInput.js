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
        color: '#6b6b6b',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 'bold', flex: sizeName }}>{name}</span>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
        style={{ flex: sizeSlider, color: '#6b6b6b' }} 
      />
      <input
        className="slider-input"
        type="number"
        value={value}
        onChange={handleInputChange}
        style={{
          flex: sizeInput,
          textAlign: 'center',
          marginLeft: '5%',
          maxWidth: '10%',
          color: '#6b6b6b', 
        }}
      />
    </div>
  );
};

export default SliderInput;
