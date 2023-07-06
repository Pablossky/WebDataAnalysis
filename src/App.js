import './App.css';
import React, { useState } from 'react';
import { Dropdown, Table } from 'semantic-ui-react';
import Chart from "./plotly/mychart.js";
import 'semantic-ui-css/semantic.min.css';

function App() {

  const XLSX = require('xlsx');

  const [data, setData] = useState([]);

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

  // Metody Interpolacji
  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Curve', value: 'curve' },
    { key: '3', text: 'Excel', value: 'excel' },
  ];

  // Dane
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

  // Wyświetlanie odpowiedniego wykresu
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


  // Wyświetlanie tabeli
  const DataTable = ({ dataNumberX, dataNumberY }) => {
    return (
      <Table celled>
        <Table.Body>
          <Table.Row>
            {dataNumberX.map((number, index) => (
              <Table.Cell key={index}>{number}</Table.Cell>
            ))}
          </Table.Row>
          <Table.Row>
            {dataNumberY.map((number, index) => (
              <Table.Cell key={index}>{number}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table>
    );
  };

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

  function clearingDataText(dataToClear) {
    const text = JSON.stringify(dataToClear);
    let readyText = text.replaceAll(/["{XY:]/g, "")
      .replaceAll(/[,[]/g, " ")
      .replaceAll("}", "\n")
      .replaceAll("]", "");

    return readyText;
  }

  function copyData() {
    const element = document.createElement("a");
    const file = new Blob([clearingDataText(data)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "data.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

const handlePaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
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

  return (
    <div className="App">

      <div className="ChartPlotter">
        {renderChart(selectedMethod)}
      </div>
      <div className="Options">
        
      <div className="InputFile">
        Wczytaj plik .xlsx
      <input className="InputButton"
      type="file" 
      accept=".xlsx, .xls" 
      onChange={handleFileUpload} 
      />
      </div>

      <div className="Space">
      </div>
        
        Wybierz metodę:
      <Dropdown
        placeholder="Choose method"
        fluid
        selection
        options={interpolationMethod}
        value={selectedMethod}
        onChange={handleDropdownChange}
        />
      </div>

      <div className="Data1">
        Data: (X, Y)
        <div className="DataList">
        {renderData(selectedMethod)}
        </div>
      </div>

      <div className="Data2">
        <button className="FunctionalButton" onClick={copyData}>Download data in .txt</button>

        <button className="FunctionalButton" onClick={() =>  navigator.clipboard.writeText(clearingDataText(data))}>
        Copy data to clipboard
        </button>

        <textarea onPaste={handlePaste}></textarea>
      </div>
    </div>
  );
}

export default App;
