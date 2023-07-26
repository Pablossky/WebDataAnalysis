// ----------------------------------------IMPORTS---------------------------------------------
// Overall
import 'toolcool-range-slider';
import 'semantic-ui-css/semantic.min.css';
import React, { useState, useEffect } from 'react';
import { Dropdown, Popup, Input, Grid, Segment } from 'semantic-ui-react';

// Functionality
import akimaInterpolate from './functionality/akimaInterpolation.js';
import applyLowpassFilter from './functionality/lowpassFilter.js';
import interpolateArray from './functionality/interpolateArray.js';
import "./functionality/dataManagement.js";
import "./functionality/plottingData.js";

// Components
import SliderInput from './components/SliderInput';
import LowpassFilter from './components/LowpassFilter';
import DownloadingData from './components/DownloadingData';
import Chart from "./components/mychart.js";
import ToggleSwitch from './components/ToggleSwitch.js';

// useStates
import {
  useSliderValue,
  useSampleCount,
  useSelectedSource,
  useOffset,
  useInterpolationOffset,
  useLowpassEnabled,
  useCutoffFrequency,
  useSampleRate,
  useOriginalChartData,
  useChartData,
  useSelectedInterpolation,
  useOffsettedChartData,
} from './hooks/useStates.js';

// ------------------------------------------CODE-----------------------------------------------

function App() {

  // useStates & useEffects
  const { sliderValue, setSliderValue } = useSliderValue(5);
  const { sampleCount, setSampleCount } = useSampleCount(5);
  const { selectedInterpolation, setSelectedInterpolation } = useSelectedInterpolation('linear');
  const { selectedSource, setSelectedSource } = useSelectedSource('dataFile');
  const { offset, setOffset } = useOffset(0);
  const { interpolationOffset, setInterpolationOffset } = useInterpolationOffset(0);
  const { lowpassFilterEnabled, setLowpassEnabled } = useLowpassEnabled(false);
  const { cutoffFrequency, setCutoffFrequency } = useCutoffFrequency(1000);
  const { sampleRate, setSampleRate } = useSampleRate(1000);
  const { originalChartData, setOriginalChartData } = useOriginalChartData({
    name: 'default',
    x: [1, 2, 3, 4],
    y: [1, 2, 1, 2]
  });
  const { chartData, setChartData } = useChartData(originalChartData); const [resampledChartData, setResampledChartData] = useState({
    name: 'Resampling',
    x: [],
    y: [],
  });
  const { offsettedChartData, setOffsettedChartData } = useOffsettedChartData({
    name: 'offsetted',
    x: [],
    y: []
  });
  const [splitIndex, setSplitIndex] = useState(originalChartData.x.length / 2);
  const [originalCopyData, setOriginalCopyData] = useState({ name: 'Copy of Original', x: [], y: [] });
  const [subtractionValue, setSubtractionValue] = useState(0.0);
  const [subtractFromOriginal, setSubtractFromOriginal] = useState(false);
  const [subtractedChartData, setSubtractedChartData] = useState({
    name: 'Subtracted',
    x: [],
    y: [],
  });

  const [cutStartIndex, setCutStartIndex] = useState(0);
  const [cutEndIndex, setCutEndIndex] = useState(originalChartData.x.length);
  const [showInput, setShowInput] = useState(true);
  const [showInterpolation, setShowInterpolation] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const [showCutting, setShowCutting] = useState(true);
  const [swapXY, setSwapXY] = useState(false);


  // Required to parse Excel data
  const XLSX = require('xlsx');

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

  const { chartData: splitDataChartData, setChartData: setSplitDataChartData } = useChartData({
    name: 'Split Data',
    x: [],
    y: [],
  });

  const originalDataCopy = {
    name: 'Original Data Copy',
    x: [...originalChartData.x],
    y: [...originalChartData.y],
    borderColor: 'purple',
  };

  const filteredDataCopy = {
    name: 'Filtered Data Copy',
    x: [...chartData.x],
    y: [...chartData.y],
    borderColor: 'blue',
  };

  const filteredChartData = lowpassFilterEnabled
    ? {
      ...chartData,
      name: 'Lowpass filter',
      y: applyLowpassFilter(originalChartData.y.slice(cutStartIndex, cutEndIndex), cutoffFrequency, sampleRate),
    }
    : {
      ...chartData,
      x: chartData.x.slice(cutStartIndex, cutEndIndex),
      y: chartData.y.slice(cutStartIndex, cutEndIndex),
    };

  const applySubtraction = (data, value) => {
    const { x, y } = data;
    const subtractedY = y.map((yValue) => yValue - value);
    return { name: 'Subtracted', x, y: subtractedY };
  };

  //---------------------------------------USE_EFFECT-----------------------------------------

  useEffect(() => {
    handleInterpolation();
    if (subtractFromOriginal) {
      const modifiedChartData = applySubtraction(originalChartData, subtractionValue);
      setSubtractedChartData(modifiedChartData);
    }
  }, [lowpassFilterEnabled, chartData, interpolationOffset, splitIndex, originalChartData, subtractFromOriginal, subtractionValue]);

  useEffect(() => {
    const { x, y } = originalChartData;
    setOriginalCopyData({ name: 'Copy of Original', x: [...x], y: [...y] });
  }, [originalChartData]);

  useEffect(() => {
    handleDataSourceSwitch(selectedSource);
  }, [swapXY]);

  //-----------------------------------------HANDLE-------------------------------------------

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
  }; // Ok

  const handleInterpolationChange = (event, { value }) => {
    setSelectedInterpolation(value);
    handleInterpolation();
  }; // Ok

  const handleCutoffFrequency = (event, value) => {
    setCutoffFrequency(value);
  }; // Ok

  const handleSampleRate = (event, value) => {
    setSampleRate(value);
  }; // Ok

  const handleSubtractionSliderChange = (event, value) => {
    setSubtractionValue(value);
    // Apply subtraction to the resampledChartData and update the chart data
    const modifiedChartData = applySubtraction(resampledChartData, value);
    setSubtractedChartData(modifiedChartData);
  };

  const handleSplitSliderChange = (event, value) => {
    setSplitIndex(value);

    const { x, y } = chartData;

    setCutStartIndex(0);
    setCutEndIndex(x.length);

    setChartData({
      name: 'Your Data',
      x: filteredChartData.x.slice(0, value).concat(x.slice(value)),
      y: filteredChartData.y.slice(0, value).concat(y.slice(value)),
    });

    const splitDataX = filteredChartData.x.slice(value);
    const splitDataY = filteredChartData.y.slice(value);

    setSplitDataChartData({
      ...filteredChartData,
      name: 'Split Data',
      x: splitDataX,
      y: splitDataY,
    });
  };

  const handleInterpolation = () => {
    const { x, y } = filteredChartData;
    const numValues = Math.round(sliderValue);

    const startIndex = offset;
    const endIndex = Math.min(offset + numValues, x.length);

    const slicedX = x.slice(startIndex, endIndex);
    const slicedY = y.slice(startIndex, endIndex);

    let interpolatedX, interpolatedY;

    if (selectedInterpolation === 'akima') {
      const { x: akimaInterpolatedX, y: akimaInterpolatedY } = akimaInterpolate(
        x,
        y,
        resampledChartData.x // Use resampledChartData.x instead of numValues
      );

      interpolatedX = akimaInterpolatedX.slice(startIndex, endIndex);
      interpolatedY = akimaInterpolatedY.slice(startIndex, endIndex);
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

  };

  const handleSliderChange = (event, value) => {
    setSliderValue(value);
    const numValues = Math.round(value);
    setSampleCount(numValues);

    let resampledX, resampledY;

    if (selectedInterpolation === 'linear') {
      const resamplingFactor = (splitDataChartData.x.length - 1) / (numValues - 1);
      resampledX = [];
      resampledY = [];

      for (let i = 0; i < numValues; i++) {
        const index = Math.floor(i * resamplingFactor);
        const remainder = i * resamplingFactor - index;

        if (remainder === 0) {
          resampledX.push(splitDataChartData.x[index]);
          resampledY.push(splitDataChartData.y[index]);
        } else {
          const interpolatedX = splitDataChartData.x[index] + remainder * (splitDataChartData.x[index + 1] - splitDataChartData.x[index]);
          const interpolatedY = splitDataChartData.y[index] + remainder * (splitDataChartData.y[index + 1] - splitDataChartData.y[index]);
          resampledX.push(interpolatedX);
          resampledY.push(interpolatedY);
        }
      }
    } else if (selectedInterpolation === 'cubic') {
      const { x: interpolatedX, y: interpolatedY } = interpolateArray(
        splitDataChartData.x,
        splitDataChartData.y,
        numValues,
        'cubic'
      );
      resampledX = interpolatedX;
      resampledY = interpolatedY;
    } else if (selectedInterpolation === 'akima') {
      const { x: akimaInterpolatedX, y: akimaInterpolatedY } = akimaInterpolate(
        splitDataChartData.x,
        splitDataChartData.y,
        resampledChartData.x // Use resampledChartData.x instead of numValues
      );

      resampledX = akimaInterpolatedX;
      resampledY = akimaInterpolatedY;
    }

    const resampledChartData = {
      name: 'Resampling',
      x: resampledX,
      y: resampledY,
    };

    setResampledChartData(resampledChartData);
  }; // ToDo limits on Akima

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
  }; // Ok

  const handleLowpassToggle = () => {
    setLowpassEnabled(!lowpassFilterEnabled);
  }; // Ok

  const handleDataSourceSwitch = (value) => {
    setSelectedSource(value);

    if (value === 'dataFile') {
      // Swap X and Y arrays if 'swapXY' is true
      const dataX = swapXY ? originalChartData.y : originalChartData.x;
      const dataY = swapXY ? originalChartData.x : originalChartData.y;

      setChartData({ name: 'dataFile', x: dataX, y: dataY });
      setOriginalChartData({ name: 'dataFile', x: dataX, y: dataY });

      // Update other datasets with swapped X and Y arrays
      setResampledChartData({
        ...resampledChartData,
        x: swapXY ? resampledChartData.y : resampledChartData.x,
        y: swapXY ? resampledChartData.x : resampledChartData.y,
      });
      setOffsettedChartData({
        ...offsettedChartData,
        x: swapXY ? offsettedChartData.y : offsettedChartData.x,
        y: swapXY ? offsettedChartData.x : offsettedChartData.y,
      });
      setInterpolatedChartData({
        ...interpolatedChartData,
        x: swapXY ? interpolatedChartData.y : interpolatedChartData.x,
        y: swapXY ? interpolatedChartData.x : interpolatedChartData.y,
      });
      setSplitDataChartData({
        ...splitDataChartData,
        x: swapXY ? splitDataChartData.y : splitDataChartData.x,
        y: swapXY ? splitDataChartData.x : splitDataChartData.y,
      });
    } else if (value === 'default') {
      // Swap X and Y arrays if 'swapXY' is true
      const defaultX = swapXY ? [1, 2, 1, 2] : [1, 2, 3, 4];
      const defaultY = swapXY ? [1, 2, 3, 4] : [1, 2, 1, 2];

      setChartData({ name: 'default', x: defaultX, y: defaultY });
      setOriginalChartData({ name: 'default', x: defaultX, y: defaultY });

      // Update other datasets with swapped X and Y arrays
      setResampledChartData({
        ...resampledChartData,
        x: swapXY ? resampledChartData.y : resampledChartData.x,
        y: swapXY ? resampledChartData.x : resampledChartData.y,
      });
      setOffsettedChartData({
        ...offsettedChartData,
        x: swapXY ? offsettedChartData.y : offsettedChartData.x,
        y: swapXY ? offsettedChartData.x : offsettedChartData.y,
      });
      setInterpolatedChartData({
        ...interpolatedChartData,
        x: swapXY ? interpolatedChartData.y : interpolatedChartData.x,
        y: swapXY ? interpolatedChartData.x : interpolatedChartData.y,
      });
      setSplitDataChartData({
        ...splitDataChartData,
        x: swapXY ? splitDataChartData.y : splitDataChartData.x,
        y: swapXY ? splitDataChartData.x : splitDataChartData.y,
      });
    } else if (value === 'interpolated') {
      // Swap X and Y arrays if 'swapXY' is true
      const { x, y } = interpolateArray(
        swapXY ? originalChartData.y : originalChartData.x,
        swapXY ? originalChartData.x : originalChartData.y,
        originalChartData.x.length,
        selectedInterpolation,
        interpolationOffset
      );

      const interpolatedX = swapXY ? y : x;
      const interpolatedY = swapXY ? x : y;

      const interpolationStart = Math.round(interpolationOffset * (interpolatedX.length - 1));
      const interpolationEnd = interpolatedX.length;

      setChartData({
        name: 'Interpolated',
        x: interpolatedX.slice(interpolationStart, interpolationEnd),
        y: interpolatedY.slice(interpolationStart, interpolationEnd),
      });

      // Update other datasets with swapped X and Y arrays
      setResampledChartData({
        ...resampledChartData,
        x: swapXY ? resampledChartData.y : resampledChartData.x,
        y: swapXY ? resampledChartData.x : resampledChartData.y,
      });
      setOffsettedChartData({
        ...offsettedChartData,
        x: swapXY ? offsettedChartData.y : offsettedChartData.x,
        y: swapXY ? offsettedChartData.x : offsettedChartData.y,
      });
      setSplitDataChartData({
        ...splitDataChartData,
        x: swapXY ? splitDataChartData.y : splitDataChartData.x,
        y: swapXY ? splitDataChartData.x : splitDataChartData.y,
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
  }; // Ok

  //----------------------------------------------APP-------------------------------------------------------

  return (
    <div className="App" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Segment style={{ width: '70%', background: '#fff', display: 'flex', alignItems: 'stretch', border: '1px solid #ccc' }}>
        <Grid columns={1} divided centered style={{ flex: 1 }}>
          <Grid.Column textAlign="center" width={16}>

            <div style={{ width: '100%', display: 'flex', alignItems: 'stretch', background: '#fff' }}>
              <Grid columns={2} divided centered style={{ flex: 1 }}>
                <Grid.Column textAlign="center" width={10}>
                  <Segment style={{ background: '#fff', border: '1px solid #ccc' }}>
                    <h1>Chart</h1>
                    <Chart
                      data={[
                        subtractedChartData,
                        filteredChartData,
                        resampledChartData,
                        offsettedChartData,
                        interpolatedChartData,
                        { ...originalCopyData, borderColor: 'purple' },
                        splitDataChartData,
                      ]}
                      legend={true}
                    />
                  </Segment>
                </Grid.Column>
                {(
                  <Grid.Column textAlign="center" width={5}>
                    <Segment style={{ background: '#fff', border: '1px solid #ccc', height: '100%', maxHeight: '100%', overflow: 'auto' }}>
                      <h1>Context menu</h1>

                      <Popup
                        content="You can show/hide some function by clicking on matching switch."
                        position="center"
                        trigger={

                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div>Show Input</div>
                              <ToggleSwitch
                                checked={showInput}
                                onChange={() => setShowInput(!showInput)}
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div>Show Interpolation</div>
                              <ToggleSwitch
                                checked={showInterpolation}
                                onChange={() => setShowInterpolation(!showInterpolation)}
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div>Show Filter</div>
                              <ToggleSwitch
                                checked={showFilter}
                                onChange={() => setShowFilter(!showFilter)}
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div>Show Cutting</div>
                              <ToggleSwitch
                                checked={showCutting}
                                onChange={() => setShowCutting(!showCutting)}
                              />
                            </div>
                          </div>
                        }
                        hoverable
                      />

                      <div className="Break"></div>

                      {showInput && (
                        <div>
                          <hr style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />
                          <strong>Input</strong>
                          <Popup
                            content="Toggle to swap X and Y arrays on the chart"
                            position="center"
                            trigger={
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ marginBottom: '5px' }}>Swap X and Y</div>
                                <ToggleSwitch
                                  checked={swapXY}
                                  onChange={() => setSwapXY(!swapXY)}
                                />
                              </div>
                            }
                            hoverable
                          />

                          <div className="Break"></div>

                          <Popup
                            content="Choose data from your computer saved in .xlsx file or paste it from your clipboard."
                            position="center"
                            trigger={
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="InputFile" style={{ marginRight: '10px' }}>
                                  <div></div>
                                  <Input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileUpload}
                                  />
                                </div>
                                <div></div>
                                <Input
                                  defaultValue="Paste data..."
                                  onChange={handlePaste}
                                />
                              </div>
                            }
                            hoverable
                          />
                        </div>
                      )}

                      <div className="Break"></div>

                      {showInterpolation && (
                        <div>
                          <hr style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />
                          <strong>Interpolation</strong>
                          <Popup
                            content="DATA SOURCE decides which operation will be done earlier. Dropdown menu contains INTERPOLATION METHODS. SAMPLE COUNT changes the number of points presented on the Chart. OFFSET gives us the opportunity to start from a non-first sample when generating the chart, and INTERPOLATION OFFSET allows us to pick the moment when interpolation starts."
                            position="center"
                            trigger={<div>
                              Interpolation method:
                              <Dropdown
                                placeholder="Choose method"
                                selection
                                options={interpolationMethod}
                                value={selectedInterpolation}
                                onChange={handleInterpolationChange}
                              />

                              <div className="Break"></div>

                              <div className="slider-container">
                                <SliderInput
                                  value={splitIndex}
                                  min={0}
                                  max={originalChartData.x.length}
                                  onChange={handleSplitSliderChange}
                                  name={'Split Position'}
                                  sizeName={30}
                                  sizeSlider={60}
                                  sizeInput={20}
                                />
                              </div>

                              <div className="slider-container">
                                <SliderInput
                                  value={subtractionValue}
                                  min={0}
                                  max={200}
                                  step={0.01}
                                  onChange={handleSubtractionSliderChange}
                                  name={'Subtraction Value'}
                                  sizeName={30}
                                  sizeSlider={60}
                                  sizeInput={20}
                                />
                              </div>

                              <div className="slider-container">
                                <SliderInput
                                  value={sliderValue}
                                  min={0}
                                  max={8 * chartData.x.length}
                                  onChange={handleSliderChange}
                                  name={'Sample Count'}
                                  sizeName={30}
                                  sizeSlider={60}
                                  sizeInput={20}
                                />
                              </div>

                              <div className="offset-slider-container">
                                <SliderInput
                                  value={offset}
                                  min={0}
                                  max={(sliderValue / 2) - 1}
                                  onChange={handleOffsetSliderChange}
                                  name={'Offset'}
                                  sizeName={30}
                                  sizeSlider={60}
                                  sizeInput={20}
                                />
                              </div>
                            </div>
                            }
                            hoverable
                          />
                        </div>
                      )}

                      <div className='Break'></div>

                      {showFilter && (
                        <div>
                          <hr style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />
                          <strong>Filter</strong>
                          <LowpassFilter
                            lowpassFilterEnabled={lowpassFilterEnabled}
                            handleLowpassToggle={handleLowpassToggle}
                            cutoffFrequency={cutoffFrequency}
                            handleCutoffFrequency={handleCutoffFrequency}
                            sampleRate={sampleRate}
                            handleSampleRate={handleSampleRate}
                          />
                        </div>
                      )}

                      <div className='Break'></div>

                      {showCutting && (
                        <div>
                          <hr style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />
                          <strong>Cutting</strong>
                          <Popup
                            content="From there you can CUT the data from start and end."
                            position="center"
                            trigger={
                              <div>
                                <SliderInput
                                  value={cutStartIndex}
                                  min={0}
                                  max={originalChartData.x.length - 1}
                                  step={1}
                                  onChange={(event, value) => setCutStartIndex(value)}
                                  name="Cut Start"
                                  sizeName={30}
                                  sizeSlider={60}
                                  sizeInput={20}
                                />
                                <SliderInput
                                  value={cutEndIndex}
                                  min={0}
                                  max={originalChartData.x.length - 1}
                                  step={1}
                                  onChange={(event, value) => setCutEndIndex(value)}
                                  name="Cut End"
                                  sizeName={30}
                                  sizeSlider={60}
                                  sizeInput={20}
                                />
                              </div>
                            }
                            hoverable
                          />
                        </div>
                      )}

                      <div className='Break'></div>

                      <div>
                        <Popup
                          content="You can download data from here."
                          position="center"
                          trigger={
                            <div>
                              <hr style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />
                              <div className='Break'></div>
                              <DownloadingData
                                data1={resampledChartData}
                                data2={chartData}
                                data3={filteredChartData}
                                buttonWidth={200}
                              />
                            </div>
                          }
                          hoverable
                        />
                      </div>
                    </Segment>
                  </Grid.Column>
                )}
              </Grid>
            </div>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
}

export default App;