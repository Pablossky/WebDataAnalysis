import './App.css';
import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Chart from "./plotly/mychart.js";
import "./functionality/dataManagement.js";
import "./functionality/plottingData.js";
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';
import Slider from '@mui/material/Slider';
import ResampledTable from './functionality/plottingData.js';

const dataManagement = require("./functionality/dataManagement");
const numeric = require('numeric');

function App() {
  const XLSX = require('xlsx');
  const [sliderValue, setSliderValue] = useState(1000);
  const [sampleCount, setSampleCount] = useState(5);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [manualSliderValue, setManualSliderValue] = useState('');
  const [selectedSource, setSelectedSource] = useState('excel');
  const [selectedInterpolation, setSelectedInterpolation] = useState('linear');
  const [offset, setOffset] = useState(0);
  const [hoveredOffset, setHoveredOffset] = useState(0);

  const [chartData, setChartData] = useState({
    name: 'linear',
    x: [1, 2, 3, 4],
    y: [3, 3, 3, 3]
  });

  const [resampledChartData, setResampledChartData] = useState({
    name: 'linear',
    x: [1, 2, 3, 4],
    y: [3, 3, 3, 3]
  });

  const [offsettedChartData, setOffsettedChartData] = useState({
    name: 'offsetted',
    x: [],
    y: []
  });

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
    } else {
      throw new Error(`Unsupported interpolation method: ${method}`);
    }

    return { x: interpolatedX, y: interpolatedY };
  }

  const dataSource = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Curve', value: 'curve' },
    { key: '3', text: 'Excel', value: 'excel' },
    { key: '4', text: 'Interpolated', value: 'interpolated' },
  ];

  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Akima', value: 'akima' },
  ];

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
    };
  };

  const handleDropdownChange = (event, { value }) => {
    setSelectedSource(value);

    if (value === 'excel') {
      setChartData({
        name: 'excel',
        x: chartData.x,
        y: chartData.y,
      });
    } else if (value === 'linear') {
      setChartData({ name: 'linear', x: [1, 2, 3, 4], y: [3, 3, 3, 3] });
    } else if (value === 'curve') {
      setChartData({ name: 'curve', x: [1, 2, 3, 4], y: [2, 5, 6, 7] });
    } else if (value === 'interpolated') {
      const { x: interpolatedX, y: interpolatedY } = interpolateArray(
        chartData.x,
        chartData.y,
        chartData.x.length,
        selectedInterpolation
      );
      const interpolatedChartData = {
        name: 'Interpolated',
        x: interpolatedX,
        y: interpolatedY,
      };
      setChartData(interpolatedChartData);
    }
  };

  const handleInterpolationChange = (event, { value }) => {
    setSelectedInterpolation(value);

    if (selectedSource === 'interpolated') {
      const { x: interpolatedX, y: interpolatedY } = interpolateArray(
        chartData.x,
        chartData.y,
        chartData.x.length,
        value
      );
      const interpolatedChartData = {
        name: 'Interpolated',
        x: interpolatedX,
        y: interpolatedY,
      };
      setChartData(interpolatedChartData);
    }
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
    const resamplingFactor = (chartData.x.length - 1) / (numValues - 1);
    const startIndex = Math.floor(value * resamplingFactor);
    const offsettedX = resampledChartData.x.slice(startIndex, startIndex + numValues);
    const offsettedY = resampledChartData.y.slice(startIndex, startIndex + numValues);

    const offsettedChartData = {
      name: 'Offsetted',
      x: offsettedX,
      y: offsettedY,
    };

    setOffsettedChartData(offsettedChartData);
  };

  const handleManualSliderChange = (e) => {
    const enteredValue = parseInt(e.target.value);
    if (!isNaN(enteredValue)) {
      setManualSliderValue(enteredValue.toString());
      setSliderValue(enteredValue);
      setSampleCount(enteredValue);
    }
  };

  const handleOffsetManualSliderChange = (e) => {
    const enteredValue = parseInt(e.target.value);
    if (!isNaN(enteredValue)) {
      setOffset(enteredValue);
    }
  };

  const handleSliderMouseEnter = (event) => {
    setHoveredValue(sliderValue);
  };

  const handleOffsetSliderMouseEnter = (event) => {
    setHoveredOffset(offset);
  };

  const handleSliderMouseLeave = (event) => {
    setHoveredValue(null);
  };

  const handleOffsetSliderMouseLeave = (event) => {
    setHoveredOffset(null);
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

    setChartData({ name: 'excel', x, y });

    event.preventDefault();
  };

  const renderData = () => {
    if (selectedSource === 'excel') {
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
    } else if (selectedSource === 'linear') {
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
    } else if (selectedSource === 'interpolated') {
      return (
        <div>
          {chartData.x.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Interpolated X</th>
                  <th>Interpolated Y</th>
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
    }
  };
  
  const renderGeneratedArray = () => {
    const array1 = resampledChartData.x.slice(offset, offset + sampleCount);
    const array2 = resampledChartData.y.slice(offset, offset + sampleCount);
  
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
        <Chart data={[chartData, resampledChartData, offsettedChartData]} />
        </div>
      </div>
      <div className="Options">
        <div className="InputFile">
          Wczytaj plik .xlsx
          <input
            className="InputButton"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>
        <div className="Space"></div>
        Źródło danych:
        <Dropdown
          placeholder="Choose method"
          selection
          options={dataSource}
          value={selectedSource}
          onChange={handleDropdownChange}
        />
        <div className="Space"></div>
        Metoda interpolacji:
        <Dropdown
          placeholder="Choose method"
          selection
          options={interpolationMethod}
          value={selectedInterpolation}
          onChange={handleInterpolationChange}
        />
        <div className="Space"></div>
        <div className="slider-container">
  <Slider
    value={sliderValue}
    min={0}
    max={8 * chartData.x.length}
    onChange={handleSliderChange}
    aria-labelledby="continuous-slider"
    onMouseEnter={handleSliderMouseEnter}
    onMouseLeave={handleSliderMouseLeave}
  />
  {hoveredValue !== null && (
    <div className="hovered-value">{hoveredValue}</div>
  )}
  <div className="manual-input">
    <input
      type="number"
      value={manualSliderValue}
      onChange={handleManualSliderChange}
      onBlur={handleManualSliderChange}
    />
  </div>
</div>

<div className="offset-slider-container">
  <Slider
    value={offset}
    min={0}
    max={(sliderValue/2) - 1}
    onChange={handleOffsetSliderChange}
    aria-labelledby="continuous-slider"
    onMouseEnter={handleOffsetSliderMouseEnter}
    onMouseLeave={handleOffsetSliderMouseLeave}
  />
  {hoveredOffset !== null && (
    <div className="hovered-offset">{hoveredOffset}</div>
  )}
  <div className="manual-input">
    <input
      type="number"
      value={offset}
      onChange={handleOffsetManualSliderChange}
      onBlur={handleOffsetManualSliderChange}
    />
  </div>

        </div>
      </div>
      <div className="Data1">
        Wklej dane:
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
            <div
              className="Box"
              style={{
                width: '200px',
                height: '250px',
                overflow: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                marginLeft: '10px', // Adjust the margin as needed
              }}
            >
              <h1>Resampled</h1>
              {renderGeneratedArray()}
            </div>
            <div
              className="Box"
              style={{
                width: '200px',
                height: '250px',
                overflow: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                marginLeft: '10px', // Adjust the margin as needed
              }}
            >
              <h1>Original</h1>
              <div>{renderData(selectedSource)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="Data2">
        <button
          className="FunctionalButton"
          onClick={() => dataManagement.copyDataToTxt(resampledChartData)}
        >
          Download resampled data in .txt
        </button>
        <button
          className="FunctionalButton"
          onClick={() => dataManagement.copyDataToTxt(chartData)}
        >
          Download original data in .txt
        </button>
        <button
          className="FunctionalButton"
          onClick={() =>
            navigator.clipboard.writeText(dataManagement.clearingDataText(chartData))
          }
        >
          Copy data to clipboard
        </button>
      </div>
    </div>
  );
}

export default App;