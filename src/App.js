import './App.css';
import React, { useState, useEffect } from 'react';
import { Dropdown, Popup } from 'semantic-ui-react';
import Chart from "./components/mychart.js";
import "./functionality/dataManagement.js";
import "./functionality/plottingData.js";
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';
import ResampledTable from './functionality/plottingData.js';
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
  const [interpolationStartIndex, setInterpolationStartIndex] = useState(0);
  const [lowpassFilterEnabled, setLowpassEnabled] = useState(false);
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

  const handleInterpolationStartChange = (event, value) => {
    setInterpolationStartIndex(value);
  };

  function interpolateArray(x, y, numValues, method) {
    let interpolatedX, interpolatedY;

    if (method === 'linear') {
      interpolatedX = [];
      interpolatedY = [];

      for (let i = 0; i < numValues; i++) {
        const fraction = i / (numValues - 1);
        const index = Math.floor(fraction * (x.length - 1));
        const dx = fraction * (x[x.length - 1] - x[0]);
        const interpolatedXValue = x[0] + dx;
        const interpolatedYValue = y[index] + (y[index + 1] - y[index]) * (dx - x[index]) / (x[index + 1] - x[index]);
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
  }, [lowpassFilterEnabled, chartData]);

  const handleCutoffFrequency = (event, value) => {
    setCutoffFrequency(value);
  };

  const handleSampleRate = (event, value) => {
    setSampleRate(value);
  };

  const handleInterpolation = () => {
    const { x, y } = chartData;
    const { x: interpolatedX, y: interpolatedY } = interpolateArray(
      x,
      y,
      x.length,
      selectedInterpolation
    );
    const interpolatedData = {
      name: 'Interpolated',
      x: interpolatedX,
      y: interpolatedY,
    };
    setInterpolatedChartData(interpolatedData);
  };

  const handleSliderChange = (event, value) => {
    setSliderValue(value);
    const numValues = Math.round(value);
    setSampleCount(numValues);

    let resampledX, resampledY;

    if (selectedInterpolation === 'linear') {
      const resamplingFactor = (chartData.x.length - 1) / (numValues - 1);
      resampledX = [];
      resampledY = [];

      for (let i = 0; i < numValues; i++) {
        const index = Math.floor(i * resamplingFactor);
        const remainder = i * resamplingFactor - index;

        if (remainder === 0) {
          resampledX.push(chartData.x[index]);
          resampledY.push(chartData.y[index]);
        } else {
          const interpolatedX = chartData.x[index] + remainder * (chartData.x[index + 1] - chartData.x[index]);
          const interpolatedY = chartData.y[index] + remainder * (chartData.y[index + 1] - chartData.y[index]);
          resampledX.push(interpolatedX);
          resampledY.push(interpolatedY);
        }
      }
    } else if (selectedInterpolation === 'akima') {
      const { x: interpolatedX, y: interpolatedY } = interpolateArray(
        chartData.x,
        chartData.y,
        numValues,
        'akima'
      );
      resampledX = interpolatedX;
      resampledY = interpolatedY;
    }

    const newChartData = {
      name: 'Interpolated/Resampled',
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
      setOriginalChartData({
        name: 'dataFile',
        x: chartData.x,
        y: chartData.y,
      });
    } else if (value === 'default') {
      setOriginalChartData({ name: 'default', x: [1, 2, 3, 4], y: [1, 2, 1, 2] });
    } else if (value === 'interpolated') {
      const { x: interpolatedX, y: interpolatedY } = interpolateArray(
        chartData.x,
        chartData.y,
        chartData.x.length,
        selectedInterpolation
      );

      const interpolationStart = Math.round(interpolationStartIndex * (interpolatedX.length - 1));
      const interpolationEnd = interpolatedX.length - 1;

      const interpolatedChartData = {
        name: 'Interpolated',
        x: interpolatedX.slice(interpolationStart, interpolationEnd),
        y: interpolatedY.slice(interpolationStart, interpolationEnd),
      };
      setOriginalChartData(interpolatedChartData);
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

  const filteredChartData = lowpassFilterEnabled
    ? {
        ...chartData,
        name: 'Lowpass filter',
        y: applyLowpassFilter(originalChartData.y, cutoffFrequency, sampleRate),
      }
    : chartData;

  const renderData = () => {
    if (selectedSource === 'dataFile') {
      return (
        <div>
          {chartData.x.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>X</th>
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {chartData.x.map((xValue, index) => (
                  <tr key={index}>
                    <td>{xValue.toFixed(3)}</td>
                    <td>{chartData.y[index].toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    } else if (selectedSource === 'default') {
      return (
        <div>
          {originalChartData.x.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>X</th>
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {originalChartData.x.map((xValue, index) => (
                  <tr key={index}>
                    <td>{xValue.toFixed(3)}</td>
                    <td>{originalChartData.y[index].toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    } else if (selectedSource === 'interpolated') {
      return (
        <div>
          {originalChartData.x.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Interpolated X</th>
                  <th>Interpolated Y</th>
                </tr>
              </thead>
              <tbody>
                {originalChartData.x.map((xValue, index) => (
                  <tr key={index}>
                    <td>{xValue.toFixed(3)}</td>
                    <td>{originalChartData.y[index].toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    }
  };

  const renderFilteredData = () => {
    if (filteredChartData.x.length > 0) {
      return (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>X</th>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              {filteredChartData.x.map((xValue, index) => (
                <tr key={index}>
                  <td>{xValue.toFixed(3)}</td>
                  <td>{filteredChartData.y[index].toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderGeneratedArray = () => {
    const array1 = resampledChartData.x.slice(offset, Math.min(offset + sampleCount));
    const array2 = resampledChartData.y.slice(offset, Math.min(offset + sampleCount));

    return (
      <div>
        <ResampledTable array1={array1} array2={array2} sampleCount={sampleCount} />
      </div>
    );
  };

  return (
    <div className="App">
      <div className="ChartPlotter">
        <div>
          <Chart data={[filteredChartData, resampledChartData, offsettedChartData, interpolatedChartData]} />
        </div>
      </div>
      <div className="Options">
      <div className="info-button">
        <Popup
          content="Choose data from your computer saved in .xlsx file.
          Data source decide which operation will be done earlier.
          Dropdown menu contains interpolation methods."
          trigger={
            <div className="ui icon button">
              <i className="info icon"></i>
            </div>
          }
        />
      </div>
        <div className="InputFile">
          Read from .xlsx file
          <input
            className="InputButton"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
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
          content="Sample Count changes number of points presented on the Chart. Offset give us oppoortunity to start from non-first sample when generating chart and interpolation offset allow us to pick moment when interpolations starts."
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
            value={interpolationStartIndex}
            min={0}
            max={sampleCount}
            step={0.01}
            onChange={handleInterpolationStartChange}
            name={'Interpolation offset'}
          />
        </div>
      </div>
      <div className="Data1">
        Paste data:
        <textarea
          className='InputData'
          defaultValue='Input data...'
          onPaste={handlePaste}
        ></textarea>
        <div className="Title1">
          Data: (X, Y)
        </div>
        <div className="DataList">
          <div className="Container">
            <DataBox
              value={renderGeneratedArray()}
              name={'Resampled'}
            />
            <DataBox
              value={renderData()}
              name={'Original'}
            />
            <DataBox
              value={renderFilteredData()}
              name={'Filtered'}
            />
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
