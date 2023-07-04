import './App.css';
import React, { useState } from 'react'
import { Dropdown, Table, Button } from 'semantic-ui-react'
import Chart from "./plotly/mychart.js";

function App() {

  //const XLSX = require('xlsx');
//
  //// Parsowanie Excelowych danych
  //function parseExcelFile(file) {
  //  const workbook = XLSX.readFile(file);
  //  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //  const jsonData = XLSX.utils.sheet_to_json(worksheet);
//
  //  const xValues = [];
  //  const yValues = [];
//
  //  for (const row of jsonData) {
  //    xValues.push(row['A']);
  //    yValues.push(row['B']);
  //  }
//
  //  return {
  //    xValues,
  //    yValues
  //  };
  //}
//
  //// Pobranie danych
  //const excelFile = './data.xlsx'
  //const parsedData = parseExcelFile(excelFile);


  // Metody Interpolacji
  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear'},
    { key: '2', text: 'Curve', value: 'curve'},
  //  { key: '3', text: 'Excel', value: 'excel'},
  ];

  // Dane
  const dataLinear = [{name:'Linear', x: [1,2,3,4], y: [3,3,3,3]}]
  const labelsLinear = [dataLinear.name, 'xAxes', 'yAxes']

  const dataCurve = [{name:'Curve', x: [1,2,3,4], y: [2,5,6,7]}]
  const labelsCurve = [dataCurve.name, 'xAxes', 'yAxes']
  
  //const dataExcel = [{name:'Excel', x: parsedData.xValues, y: parsedData.yValues}]

  const [selectedMethod, setSelectedMethod] = useState('');

  const handleDropdownChange = (event, {value}) => {
    setSelectedMethod(value);
  };

  // Wyświetlanie odpowiedniego wykresu
  const renderChart = () => {
    if (selectedMethod === 'linear') {
      return <Chart data={dataLinear} layout={labelsLinear}/>;
    }
    else if (selectedMethod === 'curve') {
      return <Chart data={dataCurve} layout={labelsCurve}/>;
    }
    //else if (selectedMethod === 'excel') {
    //  return <Chart data={dataExcel}/>;
    //}
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
    var copyText = document.getElementById("OutputData1");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  }
  
  return (
    <div className="App">
      <div className="ChartPlotter">
        {renderChart()}
      </div>
      <div className="Options">
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
        Data Linear
        <div id="OutputData1">
          <DataTable dataNumberX={[12,3,4,5]} dataNumberY={[3,5,7,3]}/>
        </div>
        Data Curve
          <DataTable dataNumberX={[2,4,7,4]} dataNumberY={[7,2,1,2]}/>
      </div>
      <div className="Data2">
        Data2
        <button onclick="CopyData()">Copy text</button>
      </div>
    </div>
  );
}

export default App;
