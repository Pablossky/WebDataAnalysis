import React, { useMemo, useState } from "react";
import Plotly from "react-plotly.js";
import { dflt } from './chart-plotly';
import { Popup } from 'semantic-ui-react';

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

  const handleSelectPoint = (event) => {
    const selectedPoint = {
      datasetIndex: event.points[0].curveNumber,
      index: event.points[0].pointIndex,
    };
  
    if (selectedPoints.point1 && !selectedPoints.point2) {
      setSelectedPoints({ ...selectedPoints, point2: selectedPoint });
  
      const result = calculateLinearRegression(selectedPoints.point1, selectedPoint);
      setLinearRegressionResult(result);
  
      const xValues = [data[selectedPoints.point1.datasetIndex].x[selectedPoints.point1.index], data[selectedPoint.datasetIndex].x[selectedPoint.index]];
      const yValues = [data[selectedPoints.point1.datasetIndex].y[selectedPoints.point1.index], data[selectedPoint.datasetIndex].y[selectedPoint.index]];
      setLinearRegressionLine({ x: xValues, y: yValues });
    } else {
      setSelectedPoints({ point1: selectedPoint, point2: null });
      setLinearRegressionResult(null);
      setLinearRegressionLine(null);
    }
  };

  return (
    <div>
      <Plotly
        data={plotData}
        layout={layout(...labels)}
        config={config}
        onClick={(event) => handleSelectPoint(event)}
        style={{ width: '100%', height: '100%' }}
      />

      <div className="info-button-regression" style={{ float: "right", display: 'flex', padding: '40px' }}>
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
        <div style={{ padding: '10px', borderRadius: '5px', marginTop: '20px', backgroundColor: '#f1f1f1' }}>
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
        </div>
      )}
    </div>
  );
}

export default Chart;
