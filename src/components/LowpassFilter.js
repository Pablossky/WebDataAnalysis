import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';
import SliderInput from './SliderInput';

export default function LowpassFilter({ lowpassFilterEnabled, handleLowpassToggle, cutoffFrequency, handleCutoffFrequency, sampleRate, handleSampleRate }) {
    return (
      <>
        <div class="ui icon button" data-content="...">
          <i class="info icon"></i>
        </div>
        <div className="LowpassToggle">
          <label>Lowpass Filter:</label>
          <input
            type="checkbox"
            checked={lowpassFilterEnabled}
            onChange={handleLowpassToggle}
          />
        </div>
        <div className="offset-slider-container">
          <SliderInput
            value={cutoffFrequency}
            min={0}
            max={2000}
            onChange={handleCutoffFrequency}
            name={'Cutoff Frequency'}
          />
        </div>
        <div className="offset-slider-container">
          <SliderInput
            value={sampleRate}
            min={0}
            max={2000}
            onChange={handleSampleRate}
            name={'Sample Rate'}
          />
        </div>
      </>
    );
  }
  
