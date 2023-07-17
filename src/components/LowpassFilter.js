import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';
import SliderInput from './SliderInput';
import { Popup } from 'semantic-ui-react';

export default function LowpassFilter({ lowpassFilterEnabled, handleLowpassToggle, cutoffFrequency, handleCutoffFrequency, sampleRate, handleSampleRate }) {
    return (
      <>
        <div className="info-button">
        <Popup
          content="You can check this box to apply lowpass filter to your data. Filtered data is printed in box with title Filtered. You can also adjust tune of filter by manipulating sliders: Cutoff Frequency and Sample Rate."
          trigger={
            <div className="ui icon button">
              <i className="info icon"></i>
            </div>
          }
        />
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
  
