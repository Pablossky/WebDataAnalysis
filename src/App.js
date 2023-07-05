import './App.css';
import React, { useState } from 'react'
import { Dropdown, Table, Button } from 'semantic-ui-react'
import Chart from "./plotly/mychart.js";
import 'semantic-ui-css/semantic.min.css'

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
      parsedData.forEach(row => {
        dataExcel.x.push(row.X)
        dataExcel.y.push(row.Y)
      })
    };
  }

  // Metody Interpolacji
  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear'},
    { key: '2', text: 'Curve', value: 'curve'},
    { key: '3', text: 'Excel', value: 'excel'},
  ];

  // Dane
  const dataLinear = {name:'Linear', x: [1,2,3,4], y: [3,3,3,3]}
  const labelsLinear = [dataLinear.name, 'xAxes', 'yAxes']

  const dataCurve = {name:'Curve', x: [1,2,3,4], y: [2,5,6,7]}
  const labelsCurve = [dataCurve.name, 'xAxes', 'yAxes']
  
  const dataExcel = {name:'Excel', x: [], y: []}
  const labelsExcel = [dataExcel.name, 'xAxes', 'yAxes']

  const [selectedMethod, setSelectedMethod] = useState('');

  const handleDropdownChange = (event, {value}) => {
    setSelectedMethod(value);
  };

  // Wyświetlanie odpowiedniego wykresu
  const renderChart = () => {
    if (selectedMethod === 'linear') {
      return <Chart data={[dataLinear]} layout={labelsLinear}/>;
    }
    else if (selectedMethod === 'curve') {
      return <Chart data={[dataCurve]} layout={labelsCurve}/>;
    }
    else if (selectedMethod === 'excel') {
      return <Chart data={[dataExcel]} layout={labelsExcel}/>;
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

  function CopyData() {
    var copyText = document.getElementById("Data1");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  }
  
  return (
    <div className="App">

      <div className="ChartPlotter">
        {renderChart()}
      </div>
      <div className="Options">
        
      <input 
      type="file" 
      accept=".xlsx, .xls" 
      onChange={handleFileUpload} 
      />

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
        Data
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
        <div id="OutputData1">
          <DataTable dataNumberX={dataLinear.x} dataNumberY={dataLinear.y}/>
        </div>
        Data Curve
          <DataTable dataNumberX={dataCurve.x} dataNumberY={dataCurve.y}/>
      </div>
      <div className="Data2">
        Data2
        <button onClick="CopyData()">Copy text</button>
      </div>
    </div>
  );
}

export default App;
