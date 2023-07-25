import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';
import SliderInput from './SliderInput';
import { Popup } from 'semantic-ui-react';

export default function LowpassFilter({ lowpassFilterEnabled, handleLowpassToggle, cutoffFrequency, handleCutoffFrequency, sampleRate, handleSampleRate }) {
  return (
    <>
      <Popup
        content="You can check this box to apply LOWPASS FILTER to your data. Filtered data is printed in box with title Filtered. You can also adjust tune of filter by manipulating sliders: CUTOFF FREQUENCY and SAMPLE RATE."
        position="center"
        trigger={<div>
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
              sizeName={30}
              sizeSlider={60}
              sizeInput={20}
            />
          </div>
          <div className="offset-slider-container">
            <SliderInput
              value={sampleRate}
              min={0}
              max={2000}
              onChange={handleSampleRate}
              name={'Sample Rate'}
              sizeName={30}
              sizeSlider={60}
              sizeInput={20}
            />
          </div>
        </div>
        }
        hoverable
      />
    </>
  );
}

