import './App.css';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Chart from "./plotly/mychart.js";
import "./functionality/dataManagement.js";
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';

const dataManagement = require("./functionality/dataManagement.js");

function App() {
  const XLSX = require('xlsx');

  const [data, setData] = useState([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [generatedArray, setGeneratedArray] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  }

  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Curve', value: 'curve' },
    { key: '3', text: 'Excel', value: 'excel' },
  ];

  const dataLinear = { name: 'Linear', x: [1, 2, 3, 4], y: [3, 3, 3, 3] }
  const labelsLinear = [dataLinear.name, 'xAxes', 'yAxes']

  const dataCurve = { name: 'Curve', x: [1, 2, 3, 4], y: [2, 5, 6, 7] }
  const labelsCurve = [dataCurve.name, 'xAxes', 'yAxes']

  const dataExcel = { name: 'Excel', x: [], y: [] }
  const labelsExcel = [dataExcel.name, 'xAxes', 'yAxes']

  const [selectedMethod, setSelectedMethod] = useState('excel');

  const handleDropdownChange = (event, { value }) => {
    setSelectedMethod(value);
  };

  const handleSliderChange = (event) => {
    const value = event.target.value;
    setSliderValue(value);
    const newArray = generateSampleArray(0, 100, value); // Adjust the range as needed
    setGeneratedArray(newArray);
  };

  const renderChart = () => {
    if (selectedMethod === 'linear') {
      return <Chart data={[dataLinear]} layout={labelsLinear} />;
    }
    else if (selectedMethod === 'curve') {
      return <Chart data={[dataCurve]} layout={labelsCurve} />;
    }
    else if (selectedMethod === 'excel') {
      return <Chart data={[dataExcel]} layout={labelsExcel} />;
    }
    else {
      return null;
    }
  }

  useEffect(() => {
    renderChart();
  }, [selectedMethod]);

  const renderData = () => {
    if (selectedMethod === 'excel') {
      return (
        <div>
          {data.length > 0 && (
            <table className="table">
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    } else if (selectedMethod === 'linear') {
      return (
        <div style={{ display: 'flex' }}>
          <div>
            <table className="table">
              <tbody>
                {dataLinear.x.map((item) => (
                  <tr key={item}>
                    <td>{item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <table className="table">
              <tbody>
                {dataLinear.y.map((item) => (
                  <tr key={item}>
                    <td>{item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (selectedMethod === 'curve') {
      return (
        <div style={{ display: 'flex' }}>
          <div>
            <table className="table">
              <tbody>
                {dataCurve.x.map((item) => (
                  <tr key={item}>
                    <td>{item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <table className="table">
              <tbody>
                {dataCurve.y.map((item) => (
                  <tr key={item}>
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
    console.log(event.clipboardData);
    console.log(window.clipboardData);
    const pastedData = clipboardData.getData('text');

    const rows = pastedData.split('\n').filter((row) => row.trim() !== '');

    const dataArray1 = [];
    const dataArray2 = [];

    rows.forEach((row) => {
      const columns = row.split('\t'); // Adjust delimiter if needed

      if (columns.length >= 2) {
        dataArray1.push(columns[0]);
        dataArray2.push(columns[1]);
      }
    });

    const combinedArrays = [];

    // Combine dataArray1 and dataArray2 into a single array
    for (let i = 0; i < Math.max(dataArray1.length, dataArray2.length); i++) {
      const element1 = dataArray1[i] || '';
      const element2 = dataArray2[i] || '';

      combinedArrays.push([element1, element2]);
    }

    setData(combinedArrays);
    event.preventDefault(); // Prevent default paste behavior
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

  const renderGeneratedArray = () => {
    return (
      <div>
        {generatedArray.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="ChartPlotter">
        <div>
          <Chart selectedMethod={selectedMethod} />
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
          onClick={dataManagement.copyDataToTxt}
        >
          Download data in .txt
        </button>
        <button
          className="FunctionalButton"
          onClick={() =>
            navigator.clipboard.writeText(dataManagement.clearingDataText(data))
          }
        >
          Copy data to clipboard
        </button>
      </div>
    </div>
  );
}

export const dataExcel = { name: 'Excel', x: [], y: [] };

export default App;
