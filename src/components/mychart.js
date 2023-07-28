import React, { useMemo, useState } from "react";
import Plotly from "react-plotly.js";
import { dflt } from './chart-plotly';

import { Popup, Grid, Segment } from 'semantic-ui-react';
import SliderInput from "./SliderInput";

const config = {
  ...dflt.config,
  ...{
    displayModeBar: 'hover', // def 'hover'
    editable: false,
  }
};

const layout = (title, xlabel, ylabel) => {
  return {
    ...dflt.layout,
    ...{
      height: 1000,
      showlegend: true,
      legend: {
        x: 1.01,
        y: 1.0,
        yanchor: 'center',
        orientation: 'v',
        font: {
          family: 'Lato',
          color: 'black',
          size: 12,
        },
      },
      xaxis: {
        ...dflt.axis,
        ...{
          title: {
            ...dflt.axis.title,
            text: xlabel,
          },
        },
      },
      yaxis: {
        ...dflt.axis,
        ...{
          title: {
            ...dflt.axis.title,
            text: ylabel,
            standoff: 70
          },
          zeroline: true,
        },
      },
      title: {
        ...dflt.layout.title,
        ...{
          text: title
        },
      },
      plot_bgcolor: 'rgba(252,252,252, 0.5)',
      paper_bgcolor: 'rgba(252,252,252, 0.5)',
    },
  }
};

const labels = ['', 'xAxis', 'yAxis']

function Chart({ data }) {
  const [selectedPoints, setSelectedPoints] = useState({ point1: null, point2: null });
  const [linearRegressionResult, setLinearRegressionResult] = useState(null);
  const [linearRegressionLine, setLinearRegressionLine] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [lineLength, setLineLength] = useState(0);
  const [linearRegressionLineLength, setLinearRegressionLineLength] = useState(1); // Add this line

  const [startOffset, setStartOffset] = useState(0);

  const plotData = useMemo(() => {
    const pData = data.map(i => {
      return {
        x: i.x,
        y: i.y,
        name: i.name,
        line: { width: 1 },
        marker: { size: 5, opacity: 0.8 },
        hovertemplate: '%{y:.2f}',
        selected: false,
      }
    });

    return pData;
  }, [data, selectedPoints]);

  const calculateLinearRegression = (point1, point2) => {
    const x1 = data[point1.datasetIndex].x[point1.index];
    const y1 = data[point1.datasetIndex].y[point1.index];
    const x2 = data[point2.datasetIndex].x[point2.index];
    const y2 = data[point2.datasetIndex].y[point2.index];

    const slope = (y2 - y1) / (x2 - x1);
    const yIntercept = y1 - slope * x1;

    return { slope, yIntercept, xDiff: x2 - x1, yDiff: y2 - y1 };
  };

  const formatLinearRegressionFunction = (slope, yIntercept) => {
    return `y = ${slope.toFixed(2)}x + ${yIntercept.toFixed(2)}`;
  };

  const updateLinearRegressionLine = (startOffset, lineLength) => {
    if (linearRegressionLine) {
      const x1 = data[selectedPoints.point1.datasetIndex].x[selectedPoints.point1.index];
      const y1 = data[selectedPoints.point1.datasetIndex].y[selectedPoints.point1.index];
      const x2 = data[selectedPoints.point2.datasetIndex].x[selectedPoints.point2.index];
      const y2 = data[selectedPoints.point2.datasetIndex].y[selectedPoints.point2.index];
  
      // Calculate the slope and y-intercept
      const slope = (y2 - y1) / (x2 - x1);
      const yIntercept = y1 - slope * x1;
  
      const x1New = x1 + startOffset;
      const y1New = yIntercept + slope * x1New;
  
      const directionX = x2 - x1;
      const directionY = y2 - y1;
  
      const currentLineLength = Math.sqrt(directionX * directionX + directionY * directionY);
  
      const unitX = directionX / currentLineLength;
      const unitY = directionY / currentLineLength;
  
      // Calculate the new ending point based on the line length and unit vector
      const x2New = x1New + unitX * lineLength;
      const y2New = y1New + unitY * lineLength;
  
      // Update the linear regression line with the new coordinates
      setLinearRegressionLine({ // Adding there the X offset probably would help, but idk
        x: [x1New, x2New],
        y: [y1New, y2New],
      });
    }
  };
  
  const handleStartSliderChange = (event, newValue) => {
    const offset = newValue - startOffset;
    setStartOffset(newValue);
    updateLinearRegressionLine(offset, lineLength);
  };

  const handleLengthSliderChange = (event, newValue) => {
    const length = newValue - lineLength;
    setLineLength(newValue);
    updateLinearRegressionLine(startOffset, length);
  };

  const handleSelectPoint = (event) => {
    const selectedPoint = {
      datasetIndex: event.points[0].curveNumber,
      index: event.points[0].pointIndex,
    };

    if (selectedPoints.point1 && !selectedPoints.point2) {
      if (
        selectedPoint.datasetIndex === selectedPoints.point1.datasetIndex &&
        selectedPoint.index === selectedPoints.point1.index
      ) {
        setSelectedPoints({ point1: null, point2: null });
        setLinearRegressionResult(null);
        setLinearRegressionLine(null);
      } else {
        setSelectedPoints({ ...selectedPoints, point2: selectedPoint });

        const result = calculateLinearRegression(selectedPoints.point1, selectedPoint);
        setLinearRegressionResult(result);
        const xValues = [data[selectedPoints.point1.datasetIndex].x[selectedPoints.point1.index], data[selectedPoint.datasetIndex].x[selectedPoint.index]];
        const yValues = [data[selectedPoints.point1.datasetIndex].y[selectedPoints.point1.index], data[selectedPoint.datasetIndex].y[selectedPoint.index]];
        setLinearRegressionLine({ x: xValues, y: yValues });
      }
    } else {
      setSelectedPoints({ point1: selectedPoint, point2: null });
      setLinearRegressionResult(null);
      setLinearRegressionLine(null);
    }
  };

  const handleSliderChange = (event, newValue, sliderType) => {
    if (sliderType === "offset") {
      // Calculate the offset from the original x values
      const offset = newValue - sliderValue;
      setSliderValue(newValue);
      updateLinearRegressionLine(offset, linearRegressionLineLength);
    } else if (sliderType === "lineLength") {
      setLinearRegressionLineLength(newValue);
      updateLinearRegressionLine(0, newValue);
    }
  };
  

  const selectedPoint1Data = selectedPoints.point1
    ? {
      x: [data[selectedPoints.point1.datasetIndex].x[selectedPoints.point1.index]],
      y: [data[selectedPoints.point1.datasetIndex].y[selectedPoints.point1.index]],
      mode: "markers",
      type: "scatter",
      name: "Selected Point 1",
      marker: { size: 8, color: "black" },
    }
    : null;

  const selectedPoint2Data = selectedPoints.point2
    ? {
      x: [data[selectedPoints.point2.datasetIndex].x[selectedPoints.point2.index]],
      y: [data[selectedPoints.point2.datasetIndex].y[selectedPoints.point2.index]],
      mode: "markers",
      type: "scatter",
      name: "Selected Point 2",
      marker: { size: 8, color: "red" },
    }
    : null;

  const lineData = linearRegressionLine
    ? {
      x: linearRegressionLine.x,
      y: linearRegressionLine.y,
      mode: "lines",
      type: "scatter",
      name: "Linear Regression Line",
      line: { color: "green", width: 2 },
    }
    : null;

  return (
    <div>
       <Plotly
      data={[...plotData, selectedPoint1Data, selectedPoint2Data, lineData].filter(Boolean)}
      layout={layout(...labels)}
      config={config}
      onClick={(event) => handleSelectPoint(event)}
      style={{ width: "100%", height: "100%" }}
    />

      <Segment style={{ width: '100%', background: '#fff', display: 'flex', alignItems: 'stretch', border: '1px solid #ccc' }}>
        <Grid columns={1} divided centered style={{ flex: 1 }}>
          <Grid.Column textAlign="center" width={16}>
            <div className="info-button-regression" style={{ float: "right", display: 'flex', padding: '10px' }}>
              <Popup
                content="After selecting two points on chart, difference in X and Y will be shown. The equation of LINEAR REGRESSION FUNCTION depends on these points"
                trigger={
                  <div className="ui icon button">
                    <i className="info icon"></i>
                  </div>
                }
              />
            </div>

            {linearRegressionResult && (
              <div style={{ padding: '10px', borderRadius: '5px', marginRight: '8%', backgroundColor: '#f1f1f1' }}>
                <div>
                  Point 1: ({data[selectedPoints.point1.datasetIndex].x[selectedPoints.point1.index]},
                  {data[selectedPoints.point1.datasetIndex].y[selectedPoints.point1.index]})
                </div>
                <div>
                  Point 2: ({data[selectedPoints.point2.datasetIndex].x[selectedPoints.point2.index]},
                  {data[selectedPoints.point2.datasetIndex].y[selectedPoints.point2.index]})
                </div>
                <div>
                  Difference in X: {linearRegressionResult.xDiff.toFixed(2)}
                </div>
                <div>
                  Difference in Y: {linearRegressionResult.yDiff.toFixed(2)}
                </div>
                <div>
                  Linear Regression Function: {formatLinearRegressionFunction(linearRegressionResult.slope, linearRegressionResult.yIntercept)}
                </div>
                <SliderInput
                value={sliderValue}
                min={-10}
                max={10}
                step={0.01}
                onChange={(event, value) => handleSliderChange(event, value, "offset")}
                name="Offset"
                sizeName={1}
                sizeSlider={8}
                sizeInput={1}
              />
              <SliderInput
                value={linearRegressionLineLength}
                min={0}
                max={100}
                step={0.01}
                onChange={(event, value) => handleSliderChange(event, value, "lineLength")}
                name="Line Length"
                sizeName={1}
                sizeSlider={8}
                sizeInput={1}
              />
              </div>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
}

export default Chart;
