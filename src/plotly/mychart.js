import React, { useMemo, useState, useEffect } from 'react';
import { ChartPlotly, dflt } from './chart-plotly';

const config = {
    ...dflt.config,
    ...{
        displayModeBar: 'hover', // def 'hover'
        editable: false,
    }
}
const layout = (title, xlabel, ylabel) => {
    return {
    ...dflt.layout, 
    ...{
      height: 600,
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

const labels = ['', 'xAxes', 'yAxes'];

function Chart({ selectedMethod }) {
  const [plotData, setPlotData] = useState([]);
  const [plotLayout, setPlotLayout] = useState(layout(...labels));

  // Update plotData and plotLayout whenever selectedMethod changes
  useEffect(() => {
    let newData;
    let newLayout;

    if (selectedMethod === 'linear') {
      newData = [
        { name: 'Linear Data', x: [1, 2, 3, 4], y: [4, 3, 2, 1] },
      ];
      newLayout = layout('Linear Chart', 'Linear X-axis', 'Linear Y-axis');
    } else if (selectedMethod === 'curve') {
      newData = [
        { name: 'Curve Data', x: [1, 2, 3, 4], y: [1, 2, 3, 4] },
      ];
      newLayout = layout('Curve Chart', 'Curve X-axis', 'Curve Y-axis');
    } else if (selectedMethod === 'excel') {
      newData = [
        { name: 'Excel Data', x: [], y: [] },
      ];
      newLayout = layout('Excel Chart', 'Excel X-axis', 'Excel Y-axis');
    }

    setPlotData(newData);
    setPlotLayout(newLayout);
  }, [selectedMethod]);

  return (
    <div>
      <ChartPlotly data={plotData} layout={plotLayout} config={dflt.config} />
    </div>
  );
}

export default Chart;