import React, { useState, useEffect } from 'react';
import { Dropdown, Popup, Input, Button } from 'semantic-ui-react';
import Chart from "./components/mychart.js";
import "./functionality/dataManagement.js";
import "./functionality/plottingData.js";
import { calculateDerivative } from './functionality/calculateDerivative.js';
import { renderData, renderFilteredData, renderGeneratedArray } from "./functionality/renderingData.js";
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';
import applyLowpassFilter from './functionality/lowpassFilter.js';
import interpolateArray from './functionality/interpolateArray.js';
import SliderInput from './components/SliderInput';
import DataBox from './components/DataBox';
import LowpassFilter from './components/LowpassFilter';
import DownloadingData from './components/DownloadingData';
import akimaInterpolate from './functionality/akimaInterpolation.js';

function App() {
  const XLSX = require('xlsx');
  const [sliderValue, setSliderValue] = useState(5);
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
  const [activeBookmark, setActiveBookmark] = useState('filter');
  const [highestDerivativeLine, setHighestDerivativeLine] = useState(null);
  const [nextPoint, setNextPoint] = useState(null);
  const [showMenu, setShowMenu] = useState(true);

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleInterpolationOffsetChange = (event, value) => {
    setInterpolationOffset(value);
  };

  const interpolationMethod = [
    { key: '1', text: 'Linear', value: 'linear' },
    { key: '2', text: 'Cubic', value: 'cubic' },
    { key: '3', text: 'Akima', value: 'akima' },
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

  const handleCutoffFrequency = (event, value) => {
    setCutoffFrequency(value);
  };

  const handleSampleRate = (event, value) => {
    setSampleRate(value);
  };

  const handleBookmarkClick = (bookmark) => {
    setActiveBookmark(bookmark);
  };

  const handleInterpolation = () => {
    const { x, y } = chartData;
    const numValues = Math.round(sliderValue);
    const startIndex = Math.round(interpolationOffset * (x.length - numValues));
    const slicedX = x.slice(startIndex, startIndex + numValues);
    const slicedY = y.slice(startIndex, startIndex + numValues);

    let interpolatedX, interpolatedY;

    if (selectedInterpolation === 'akima') {
      const interpolatedData = interpolateArray(
        interpolatedChartData.x,
        interpolatedChartData.y,
        numValues,
        'akima',
        offset
      );

      interpolatedX = interpolatedData.x.slice(0, numValues);
      interpolatedY = interpolatedData.y.slice(0, numValues);
    } else {
      const { x: otherInterpolatedX, y: otherInterpolatedY } = interpolateArray(
        slicedX,
        slicedY,
        numValues,
        selectedInterpolation
      );

      interpolatedX = otherInterpolatedX;
      interpolatedY = otherInterpolatedY;
    }

    const interpolatedData = {
      name: 'Interpolated',
      x: interpolatedX,
      y: interpolatedY,
    };

    setInterpolatedChartData(interpolatedData);
    handleSelectArea(startIndex, startIndex + numValues);
  }

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
    } else if (selectedInterpolation === 'cubic') {
      const { x: interpolatedX, y: interpolatedY } = interpolateArray(
        filteredChartData.x,
        filteredChartData.y,
        numValues,
        'cubic'
      );
      resampledX = interpolatedX;
      resampledY = interpolatedY;
    } else if (selectedInterpolation === 'akima') {
      const { x, y } = chartData;
      const startIndex = Math.round(interpolationOffset * (x.length - numValues));

      const slicedX = x.slice(startIndex, startIndex + numValues);
      const slicedY = y.slice(startIndex, startIndex + numValues);

      const { x: interpolatedX, y: interpolatedY } = akimaInterpolate(
        slicedX,
        slicedY,
        numValues,
        offset
      );

      resampledX = interpolatedX;
      resampledY = interpolatedY;

      const interpolatedData = {
        name: 'Interpolated',
        x: interpolatedX,
        y: interpolatedY,
      };
      setInterpolatedChartData(interpolatedData);

      handleSelectArea(startIndex, startIndex + numValues);
    }

    const resampledChartData = {
      name: 'Resampling',
      x: resampledX,
      y: resampledY,
    };

    setResampledChartData(resampledChartData);
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

    let areaData = selectedChartData;

    if (selectedSource !== 'interpolated') {
      const derivative = calculateDerivative(selectedY);

      const maxDerivativeIndex = derivative.indexOf(Math.max(...derivative));

      const start = startIndex + maxDerivativeIndex;
      const end = startIndex + maxDerivativeIndex + 1;

      const highestIncomeX = x.slice(start, end);
      const highestIncomeY = y.slice(start, end);

      const highestIncomeArea = {
        name: 'Highest Derivative',
        x: highestIncomeX,
        y: highestIncomeY,
      };

      areaData = highestIncomeArea;

      const nextPointIndex = start + 1;
      if (nextPointIndex < x.length) {
        const highestDerivativeLineData = {
          datasets: [{
            label: 'Highest Derivative Line',
            data: [
              { x: highestIncomeX[0], y: highestIncomeY[0] },
              { x: x[nextPointIndex], y: y[nextPointIndex] },
            ],
            fill: false,
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [5, 5],
          }],
        };
        setHighestDerivativeLine(highestDerivativeLineData);

        const nextPointData = {
          datasets: [{
            label: 'Next Point',
            data: [{ x: x[nextPointIndex], y: y[nextPointIndex] }],
            backgroundColor: 'red',
            borderColor: 'red',
            pointRadius: 5,
            pointHoverRadius: 7,
          }],
        };
        setNextPoint(nextPointData);
      } else {
        setHighestDerivativeLine(null);
        setNextPoint(null);
      }
    }

    setSelectedArea(showSelectedArea ? areaData : {});
  };


  return (
    <div className="App">
      <div className="ChartPlotter" style={{ width: showMenu ? '55%' : '98%' }}>
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

      {showMenu && (
        <div className="OptionsPanel">
          <div className="ui fluid vertical pointing menu">
            <Button
              className={`Bookmark ${activeBookmark === 'input' ? 'active' : ''}`}
              onClick={() => handleBookmarkClick('input')}
              primary={activeBookmark === 'input'}
            >
              Input Options
            </Button>
            <Button
              className={`Bookmark ${activeBookmark === 'filter' ? 'active' : ''}`}
              onClick={() => handleBookmarkClick('filter')}
              primary={activeBookmark === 'filter'}
            >
              Filter Options
            </Button>
            <Button
              className={`Bookmark ${activeBookmark === 'interpolation' ? 'active' : ''}`}
              onClick={() => handleBookmarkClick('interpolation')}
              primary={activeBookmark === 'interpolation'}
            >
              Interpolation Options
            </Button>
            <Button
              className={`Bookmark ${activeBookmark === 'data' ? 'active' : ''}`}
              onClick={() => handleBookmarkClick('data')}
              primary={activeBookmark === 'data'}
            >
              Data Tables
            </Button>
            <Button
              className={`Bookmark ${activeBookmark === 'downloading' ? 'active' : ''}`}
              onClick={() => handleBookmarkClick('downloading')}
              primary={activeBookmark === 'downloading'}
            >
              Downloading Data
            </Button>
          </div>

          {activeBookmark === 'input' && (
            <div className="InputData">
              <div className="info-button">
                <Popup
                  content="Choose data from your computer saved in .xlsx file or paste it from your clipboard."
                  trigger={
                    <div className="ui icon button">
                      <i className="info icon"></i>
                    </div>
                  }
                />
              </div>
              <div className="InputFile">
                Import .xlsx file
                <div></div>
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />

                <div className="Space"></div>
                Paste data from clipboard
                <div></div>
                <Input
                  className="InputData"
                  defaultValue="Input data..."
                  onChange={handlePaste}
                />
              </div>
              <div className="Space"></div>

            </div>
          )}

          {activeBookmark === 'filter' && (
            <div className="FilterOptions">
              <div>
                <LowpassFilter
                  lowpassFilterEnabled={lowpassFilterEnabled}
                  handleLowpassToggle={handleLowpassToggle}
                  cutoffFrequency={cutoffFrequency}
                  handleCutoffFrequency={handleCutoffFrequency}
                  sampleRate={sampleRate}
                  handleSampleRate={handleSampleRate}
                />
              </div>
            </div>
          )}

          {activeBookmark === 'interpolation' && (
            <div className="InterpolationOptions">


              <div className="info-button">
                <Popup
                  content="
                  DATA SOURCE decides which operation will be done earlier.
                  Dropdown menu contains INTERPOLATION METHODS. SAMPLE COUNT changes the number of points presented on the Chart. OFFSET gives us the opportunity to start from a non-first sample when generating the chart, and INTERPOLATION OFFSET allows us to pick the moment when interpolation starts."
                  trigger={
                    <div className="ui icon button">
                      <i className="info icon"></i>
                    </div>
                  }
                />
              </div>
              Interpolation method:
              <Dropdown
                placeholder="Choose method"
                selection
                options={interpolationMethod}
                value={selectedInterpolation}
                onChange={handleInterpolationChange}
              />
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
              <div className="ShowOption">
                <input
                  type="checkbox"
                  checked={showSelectedArea}
                  onChange={handleShowSelectedArea}
                />
                Show point with the highest derivative
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
          )}

          {activeBookmark === 'data' && (
            <div className="DataTables">
              <div className="info-button">
                <Popup
                  content="ORIGINAL presents imported or pasted data. FILTERED shows original data after applying a lowpass filter (only if this option is turned on). RESAMPLED returns filtered data after applying all modifications."
                  trigger={
                    <div className="ui icon button">
                      <i className="info icon"></i>
                    </div>
                  }
                />
              </div>

              <div className="Space"></div>
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
              </div>
            </div>
          )}

          {activeBookmark === 'downloading' && (
            <div className="Downloading">
              <DownloadingData
                data1={resampledChartData}
                data2={chartData}
                data3={filteredChartData}
              />
            </div>
          )}
        </div>
      )}

      <Button
        className="ToggleMenuButton"
        onClick={handleToggleMenu}
        icon={showMenu ? 'expand' : 'align justify'}
        size="large"
      />
    </div>
  );
}

export default App;
