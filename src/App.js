import React, { useState, useEffect } from 'react';
import { Dropdown, Popup, Input } from 'semantic-ui-react';
import Chart from "./components/mychart.js";
import "./functionality/dataManagement.js";
import "./functionality/plottingData.js";
import { calculateDerivative } from './functionality/calculateDerivative.js';
import { renderData, renderFilteredData, renderGeneratedArray } from "./functionality/renderingData.js";
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';
import applyLowpassFilter from './functionality/lowpassFilter.js';
import SliderInput from './components/SliderInput';
import DataBox from './components/DataBox';
import LowpassFilter from './components/LowpassFilter';
import DownloadingData from './components/DownloadingData';

const numeric = require('numeric');

function App() {
  const XLSX = require('xlsx');
  const [sliderValue, setSliderValue] = useState(2);
  const [sampleCount, setSampleCount] = useState(5);
  const [selectedSource, setSelectedSource] = useState('dataFile');
  const [selectedInterpolation, setSelectedInterpolation] = useState('linear');
  const [offset, setOffset] = useState(0);
  const [interpolationOffset, setInterpolationOffset] = useState(0);
  const [lowpassFilterEnabled, setLowpassEnabled] = useState(false);
  const [printSelectedArea, setPrintSelectedArea] = useState(false);
  const [showSelectedArea, setShowSelectedArea] = useState(false);
  const [cutoffFrequency, setCutoffFrequency] = useState(1000);
  const [sampleRate, setSampleRate] = useState(1000);
  const [originalChartData, setOriginalChartData] = useState({
    name: 'default',
    x: [1, 2, 3, 4],
    y: [1, 2, 1, 2]
  });
  const [chartData, setChartData] = useState(originalChartData);
  const [resampledChartData, setResampledChartData] = useState(originalChartData);
  const [offsettedChartData, setOffsettedChartData] = useState({
    name: 'offsetted',
    x: [],
    y: []
  });
  const [selectedArea, setSelectedArea] = useState({});

  const handleInterpolationOffsetChange = (event, value) => {
    setInterpolationOffset(value);
  };

  function interpolateArray(x, y, numValues, method, offset) {
    let interpolatedX, interpolatedY;

    if (method === 'linear') {
      interpolatedX = [];
      interpolatedY = [];

      for (let i = 0; i < numValues; i++) {
        const fraction = i / (numValues - 1);
        const index = Math.floor(fraction * (x.length - 1));
        const dx = fraction * (x[x.length - 1] - x[0]);
        const interpolatedXValue = x[0] + dx;
        const interpolatedYValue = y[index + offset] + (y[index + offset + 1] - y[index + offset]) * (dx - x[index + offset]) / (x[index + offset + 1] - x[index + offset]);
        interpolatedX.push(interpolatedXValue);
        interpolatedY.push(interpolatedYValue);
      }
    } else if (method === 'akima') {
      const interpolator = numeric.spline(x, y, 'akima');

      interpolatedX = numeric.linspace(x[0], x[x.length - 1], numValues);
      interpolatedY = interpolatedX.map((value) => interpolator.at(value));
    }

    return { x: interpolatedX, y: interpolatedY };
  }

  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Akima', value: 'akima' },
  ];

  const [interpolatedChartData, setInterpolatedChartData] = useState({
    name: 'Interpolated',
    x: [],
    y: []
  });

  const handlePrintSelectedArea = () => {
    setPrintSelectedArea(!printSelectedArea);
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const x = parsedData.map((item) => parseFloat(item.X));
      const y = parsedData.map((item) => parseFloat(item.Y));

      setChartData({ name: 'Your Data', x, y });
      setOriginalChartData({ name: 'Your Data', x, y });
    };
  };

  const handleInterpolationChange = (event, { value }) => {
    setSelectedInterpolation(value);
    handleInterpolation();
  };

  useEffect(() => {
    handleInterpolation();
  }, [lowpassFilterEnabled, chartData, interpolationOffset]);

  useEffect(() => {
    handleInterpolation();
  }, [lowpassFilterEnabled, chartData]);

  const handleCutoffFrequency = (event, value) => {
    setCutoffFrequency(value);
  };

  const handleSampleRate = (event, value) => {
    setSampleRate(value);
  };

  const handleInterpolation = () => {
    const { x, y } = chartData;
    const numValues = Math.round(sliderValue);
    const startIndex = Math.round(interpolationOffset * (x.length - numValues));

    const slicedX = x.slice(startIndex, startIndex + numValues);
    const slicedY = y.slice(startIndex, startIndex + numValues);

    const { x: interpolatedX, y: interpolatedY } = interpolateArray(
      slicedX,
      slicedY,
      numValues,
      selectedInterpolation
    );

    const interpolatedData = {
      name: 'Interpolated',
      x: interpolatedX,
      y: interpolatedY,
    };
    setInterpolatedChartData(interpolatedData);

    // Select and display the area on the chart
    handleSelectArea(startIndex, startIndex + numValues);
  };

  const handleSliderChange = (event, value) => {
    setSliderValue(value);
    const numValues = Math.round(value);
    setSampleCount(numValues);

    let resampledX, resampledY;

    if (selectedInterpolation === 'linear') {
      const resamplingFactor = (filteredChartData.x.length - 1) / (numValues - 1);
      resampledX = [];
      resampledY = [];

      for (let i = 0; i < numValues; i++) {
        const index = Math.floor(i * resamplingFactor);
        const remainder = i * resamplingFactor - index;

        if (remainder === 0) {
          resampledX.push(filteredChartData.x[index]);
          resampledY.push(filteredChartData.y[index]);
        } else {
          const interpolatedX = filteredChartData.x[index] + remainder * (filteredChartData.x[index + 1] - filteredChartData.x[index]);
          const interpolatedY = filteredChartData.y[index] + remainder * (filteredChartData.y[index + 1] - filteredChartData.y[index]);
          resampledX.push(interpolatedX);
          resampledY.push(interpolatedY);
        }
      }
    } else if (selectedInterpolation === 'akima') {
      const { x: interpolatedX, y: interpolatedY } = interpolateArray(
        filteredChartData.x,
        filteredChartData.y,
        numValues,
        'akima'
      );
      resampledX = interpolatedX;
      resampledY = interpolatedY;
    }

    const newChartData = {
      name: 'Resampling',
      x: resampledX,
      y: resampledY,
    };

    setResampledChartData(newChartData);
  };

  const handleOffsetSliderChange = (event, value) => {
    setOffset(value);

    const numValues = Math.round(sliderValue);
    const offsettedX = resampledChartData.x.slice(offset, Math.min(offset + numValues, resampledChartData.x.length));
    const offsettedY = resampledChartData.y.slice(offset, Math.min(offset + numValues, resampledChartData.y.length));

    const offsettedChartData = {
      name: 'Offsetted',
      x: offsettedX,
      y: offsettedY,
    };

    setOffsettedChartData(offsettedChartData);
  };

  const handleLowpassToggle = () => {
    setLowpassEnabled(!lowpassFilterEnabled);
  };

  const handleDataSourceSwitch = (value) => {
    setSelectedSource(value);

    if (value === 'dataFile') {
      setChartData({
        name: 'dataFile',
        x: originalChartData.x,
        y: originalChartData.y,
      });
    } else if (value === 'default') {
      setChartData({ name: 'default', x: [1, 2, 3, 4], y: [1, 2, 1, 2] });
    } else if (value === 'interpolated') {
      const { x: interpolatedX, y: interpolatedY } = interpolateArray(
        originalChartData.x,
        originalChartData.y,
        originalChartData.x.length,
        selectedInterpolation,
        interpolationOffset
      );

      const interpolationStart = Math.round(interpolationOffset * (interpolatedX.length - 1));
      const interpolationEnd = interpolatedX.length;

      setChartData({
        name: 'Interpolated',
        x: interpolatedX.slice(interpolationStart, interpolationEnd),
        y: interpolatedY.slice(interpolationStart, interpolationEnd),
      });
    }
  };

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');

    const rows = pastedData.split('\n').filter((row) => row.trim() !== '');

    const parsedData = rows.map((row) => {
      const columns = row.split('\t');

      return {
        X: parseFloat(columns[0]) || 0,
        Y: parseFloat(columns[1]) || 0,
      };
    });

    const x = parsedData.map((item) => item.X);
    const y = parsedData.map((item) => item.Y);

    setChartData({ name: 'dataFile', x, y });
    setOriginalChartData({ name: 'dataFile', x, y });

    event.preventDefault();
  };

  const handleShowSelectedArea = () => {
    setShowSelectedArea(!showSelectedArea);
  };
  

  const filteredChartData = lowpassFilterEnabled
    ? {
      ...chartData,
      name: 'Lowpass filter',
      y: applyLowpassFilter(originalChartData.y, cutoffFrequency, sampleRate),
    }
    : chartData;

    const handleSelectArea = (startIndex, endIndex) => {
      const { x, y } = chartData;
    
      const selectedX = x.slice(startIndex, endIndex);
      const selectedY = y.slice(startIndex, endIndex);
    
      const selectedChartData = {
        name: 'Selected Area',
        x: selectedX,
        y: selectedY,
      };
    
      const derivative = calculateDerivative(selectedY);
    
      // Find the index of the highest income (maximum derivative value)
      const maxDerivativeIndex = derivative.indexOf(Math.max(...derivative));
    
      // Calculate the start and end indices based on the maximum derivative index
      const start = startIndex + maxDerivativeIndex;
      const end = startIndex + maxDerivativeIndex + 1;
    
      const highestIncomeX = x.slice(start, end);
      const highestIncomeY = y.slice(start, end);
    
      const highestIncomeArea = {
        name: 'Highest Income',
        x: highestIncomeX,
        y: highestIncomeY,
      };
    
      setSelectedArea(showSelectedArea ? highestIncomeArea : {});
    };
    
  return (
    <div className="App">
      <div className="ChartPlotter">
        <div>
          <Chart
            data={[
              filteredChartData,
              resampledChartData,
              offsettedChartData,
              interpolatedChartData,
              showSelectedArea ? selectedArea : {},
            ]}
          />
        </div>
      </div>
      <div className="Options">
        <div className="info-button">
          <Popup
            content="Choose data from your computer saved in .xlsx file.
          DATA SOURCE decides which operation will be done earlier.
          Dropdown menu contains INTERPOLATION METHODS."
            trigger={
              <div className="ui icon button">
                <i className="info icon"></i>
              </div>
            }
          />
        </div>
        <div className="InputFile">
          Import .xlsx file
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
          <Input
            className="InputData"
            defaultValue="Input data..."
            onChange={handlePaste}
          />
        </div>
        <div className="Space"></div>
        Data source:
        <div className="ui buttons">
          <button
            className={`ui button ${selectedSource === 'dataFile' ? 'active' : ''}`}
            onClick={() => handleDataSourceSwitch('dataFile')}
          >
            Original
          </button>
          <button
            className={`ui button ${selectedSource === 'interpolated' ? 'active' : ''}`}
            onClick={() => handleDataSourceSwitch('interpolated')}
          >
            Interpolated
          </button>
        </div>
        <div className="Space"></div>

        Interpolation method:
        <Dropdown
          placeholder="Choose method"
          selection
          options={interpolationMethod}
          value={selectedInterpolation}
          onChange={handleInterpolationChange}
        />
        <div className="ShowOption">
          <input
            type="checkbox"
            checked={showSelectedArea}
            onChange={handleShowSelectedArea}
          />
          Show Selected Area on Chart
        </div>
        <div className="Space"></div>
        <LowpassFilter
          lowpassFilterEnabled={lowpassFilterEnabled}
          handleLowpassToggle={handleLowpassToggle}
          cutoffFrequency={cutoffFrequency}
          handleCutoffFrequency={handleCutoffFrequency}
          sampleRate={sampleRate}
          handleSampleRate={handleSampleRate}
        />

        <div className="Space"></div>
        <div className="info-button">
          <Popup
            content="SAMPLE COUNT changes the number of points presented on the Chart. OFFSET gives us the opportunity to start from a non-first sample when generating the chart, and INTERPOLATION OFFSET allows us to pick the moment when interpolation starts."
            trigger={
              <div className="ui icon button">
                <i className="info icon"></i>
              </div>
            }
          />
        </div>
        <div className="slider-container">
          <SliderInput
            value={sliderValue}
            min={0}
            max={8 * chartData.x.length}
            onChange={handleSliderChange}
            name={'Sample Count'}
          />
        </div>

        <div className="offset-slider-container">
          <SliderInput
            value={offset}
            min={0}
            max={(sliderValue / 2) - 1}
            onChange={handleOffsetSliderChange}
            name={'Offset'}
          />
        </div>

        <div className="slider-container">
          <SliderInput
            value={interpolationOffset}
            min={0}
            max={sampleCount - 1}
            step={1}
            onChange={handleInterpolationOffsetChange}
            name={'Interpolation offset'}
          />
        </div>
      </div>
      <div className="Data1">
        <div className='Space'></div>
        <div className="DataList">
          <div className="Container">
            <DataBox
              value={renderGeneratedArray(resampledChartData, offset, sampleCount)}
              name={'Resampled'}
            />
            <DataBox
              value={renderData(chartData, originalChartData, selectedSource)}
              name={'Original'}
            />
            <DataBox
              value={renderFilteredData(filteredChartData)}
              name={'Filtered'}
            />
            <div className="info-button2">
              <Popup
                content="ORIGINAL presents imported or pasted data. FILTERED shows original data after applying a lowpass filter (only if this option is turned on). RESAMPLED returns filtered data after applying all modifications."
                trigger={
                  <div className="ui icon button">
                    <i className="info icon"></i>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
      <DownloadingData
        data1={resampledChartData}
        data2={chartData}
        data3={filteredChartData}
      />
    </div>
  );
}

export default App;
