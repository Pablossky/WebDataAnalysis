import './App.css';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Chart from "./plotly/mychart.js";
import "./functionality/dataManagement.js";
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';

const dataManagement = require("./functionality/dataManagement");

function App() {
  const XLSX = require('xlsx');
  const [sliderValue, setSliderValue] = useState(50);

  const [chartData, setChartData] = useState(
    {name:'linear',x:[1, 2, 3, 4],y:[3, 3, 3, 3]}
)

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
    parsedData.forEach((o)=>{x.push(o.X);y.push(o.Y)})
    console.log(x);

    setChartData({name:'excel',x,y})
  };
}

  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Curve', value: 'curve' },
    { key: '3', text: 'Excel', value: 'excel' },
  ];

  const dataLinear = { name: 'Linear', x: [1, 2, 3, 4], y: [3, 3, 3, 3] }
  const dataCurve = { name: 'Curve', x: [1, 2, 3, 4], y: [2, 5, 6, 7] }

  const [selectedMethod, setSelectedMethod] = useState('excel');

  const handleDropdownChange = (event, { value }) => {
    setSelectedMethod(value);
  
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

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value);
    setSliderValue(value);
  
    const startIndex = 0;
    const endIndex = chartData.x.length - 1;
  
    const numValues = Math.round((endIndex - startIndex + 1) * (value / 100));
    const newArray = generateSampleArray(startIndex, endIndex, numValues);
  
    const newChartData = {
      ...chartData,
      x: newArray,
      y: newArray,
    };
  
    setChartData(newChartData);
  };

  const generateSampleArray = (start, end, numValues) => {
    const step = (end - start) / (numValues - 1);
    const newArray = [];
  
    for (let i = 0; i < numValues; i++) {
      const value = start + step * i;
      newArray.push(value);
    }
  
    return newArray;
  };
  
  useEffect(() => {
    const startIndex = 0;
    const endIndex = Math.floor((sliderValue / 100) * (chartData.x.length - 1));
  
    const newData = chartData.x.slice(startIndex, endIndex + 1);
    const newChartData = {
      name: 'excel',
      x: newData,
      y: chartData.y.slice(startIndex, endIndex + 1),
    };
  
    setChartData(newChartData);
  }, [sliderValue]);

  const renderData = () => {
    if (selectedMethod === 'excel') {
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
    } else if (selectedMethod === 'linear' || selectedMethod === 'curve') {
      const data = selectedMethod === 'linear' ? dataLinear : dataCurve;
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
    const resampledX = generateSampleArray(0, 100, chartData.x.length);
    const resampledY = generateSampleArray(0, 100, chartData.y.length);
  
    return (
      <div>
        {resampledX.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>X</th>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              {resampledX.map((xValue, index) => (
                <tr key={index}>
                  <td>{xValue}</td>
                  <td>{resampledY[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="ChartPlotter">
        <div>
          <Chart data={[chartData]} />
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
        Wybierz metodę:
        <Dropdown
          placeholder="Choose method"
          selection
          options={interpolationMethod}
          value={selectedMethod}
          onChange={handleDropdownChange}
        />
        <div className="Space"></div>
        <div className="Space"></div>
        <toolcool-range-slider
          min="-100"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
        >
          Number of samples
        </toolcool-range-slider>
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
              <div>{renderGeneratedArray()}</div>
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
              <div>{renderData(selectedMethod)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="Data2">
        <button
          className="FunctionalButton"
          onClick={ () =>
            dataManagement.copyDataToTxt(chartData)
          }
        >
          Download data in .txt
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
};

export default App;
