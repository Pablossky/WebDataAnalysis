import './App.css';
import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Chart from "./plotly/mychart.js";
import "./functionality/dataManagement.js";
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';
import Slider from '@mui/material/Slider';

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

  const [chartData, setChartData] = useState(
    { name: 'linear', x: [1, 2, 3, 4], y: [3, 3, 3, 3] }
  )

  const [resampledChartData, setResampledChartData] = useState(
    { name: 'linear', x: [1, 2, 3, 4], y: [3, 3, 3, 3] }
  );

  function ResampledTable({ array1, array2, sampleCount }) {
    const resamplingFactor = array1.length / sampleCount;
    const resampledArray1 = [];
    const resampledArray2 = [];

    for (let i = 0; i < sampleCount; i++) {
      const index = Math.round(i * resamplingFactor);
      resampledArray1.push(array1[index]);
      resampledArray2.push(array2[index]);
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {resampledArray1.map((value, index) => (
            <tr key={index}>
              <td>{value}</td>
              <td>{resampledArray2[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      console.log(parsedData);

      const x = [];
      const y = [];
      parsedData.forEach((o) => { x.push(o.X); y.push(o.Y) })
      console.log(x);

      setChartData({ name: 'excel', x, y })
    };
  }

  const dataSource = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Curve', value: 'curve' },
    { key: '3', text: 'Excel', value: 'excel' },
  ];

  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Akima', value: 'akima' },
  ];

  const dataLinear = { name: 'Linear', x: [1, 2, 3, 4], y: [3, 3, 3, 3] };
  const dataCurve = { name: 'Curve', x: [1, 2, 3, 4], y: [2, 5, 6, 7] };

  const handleDropdownChange = (event, { value }) => {
    setSelectedSource(value);

    if (value === 'excel') {
      setChartData({
        name: 'excel',
        x: chartData.x,
        y: chartData.y,
      });
    } else if (value === 'linear') {
      setChartData(dataLinear);
    } else if (value === 'curve') {
      setChartData(dataCurve);
    }
  };

  const handleInterpolationChange = (event, { value }) => {
    setSelectedInterpolation(value);
  };

  const handleSliderChange = (event, value) => {
    setSliderValue(value);
  
    const numValues = Math.round(value);
    setSampleCount(numValues);
  
    const method = selectedInterpolation === 'akima' ? 'akima' : 'linear';
  
    const { x: resampledX, y: resampledY } = interpolateArray(
      chartData.x,
      chartData.y,
      numValues,
      method
    );
  
    const newChartData = {
      name: 'Interpolated/Resampled',
      x: resampledX,
      y: resampledY,
    };
  
    setResampledChartData(newChartData);
  };
  
  

  const handleManualSliderChange = () => {
    const enteredValue = parseInt(manualSliderValue);
    if (!isNaN(enteredValue)) {
      setSliderValue(enteredValue);
      handleSliderChange(null, enteredValue);
    }
  };

  const handleSliderMouseEnter = (event) => {
    setHoveredValue(sliderValue);
  };

  const handleSliderMouseLeave = (event) => {
    setHoveredValue(null);
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
                  <td>{xValue}</td>
                  <td>{chartData.y[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  } else if (selectedSource === 'linear' || selectedSource === 'curve') {
    const data = selectedSource === 'linear' ? dataLinear : dataCurve;
    return (
      <div style={{ display: 'flex' }}>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>X</th>
              </tr>
            </thead>
            <tbody>
              {data.x.map((item, index) => (
                <tr key={index}>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              {data.y.map((item, index) => (
                <tr key={index}>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};


  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');

    const rows = pastedData.split('\n').filter((row) => row.trim() !== '');

    const parsedData = rows.map((row) => {
      const columns = row.split('\t');

      return {
        X: columns[0] || '',
        Y: columns[1] || '',
      };
    });

    const x = parsedData.map((item) => item.X);
    const y = parsedData.map((item) => item.Y);

    setChartData({ name: 'excel', x, y });

    event.preventDefault();
  };

  const renderGeneratedArray = () => {
    const array1 = resampledChartData.x;
    const array2 = resampledChartData.y;
  
    return (
      <div>
        <ResampledTable array1={array1} array2={array2} sampleCount={sampleCount} />
      </div>
    );
  };

  
    function interpolateArray(x, y, numValues, method) {
      let interpolatedX, interpolatedY;
    
      if (method === 'linear') {
        interpolatedX = [];
        interpolatedY = [];
    
        for (let i = 0; i < x.length - 1; i++) {
          interpolatedX.push(x[i]);
          interpolatedY.push(y[i]);

          console.log(interpolatedX);
    
          const xStep = (x[i + 1] - x[i])/numValues;
          const yStep = (y[i + 1] - y[i])/numValues;
    
          for (let j = 1; j < numValues; j++) {
            const newX = x[i] + j * xStep;
            const newY = y[i] + j * yStep;
            interpolatedX.push(newX);
            interpolatedY.push(newY);
          }
        }
    
        interpolatedX.push(x[x.length - 1]);
        interpolatedY.push(y[y.length - 1]);
        
    } else if (method === 'akima') {
      const interpolator = numeric.spline(x, y, 'akima');
  
      interpolatedX = numeric.linspace(x[0], x[x.length - 1], numValues);
      interpolatedY = interpolatedX.map((value) => interpolator.at(value));
    }
  
    return { x: interpolatedX, y: interpolatedY };
  }
  
  

  return (
    <div className="App">
      <div className="ChartPlotter">
        <div>
          <Chart data={[chartData, resampledChartData]} />
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
            max={8*chartData.x.length}
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
              onChange={(e) => setManualSliderValue(e.target.value)}
            />
            <button onClick={handleManualSliderChange}>Set Value</button>
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
          onClick={() => dataManagement.copyDataToTxt(chartData)}
        >
          Download resampled data in .txt
        </button>
        <button
          className="FunctionalButton"
          onClick={() => dataManagement.copyDataToTxt(dataLinear)}
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
