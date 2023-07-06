import React, { useMemo, useState} from "react";
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

const labels = ['', 'xAxes', 'yAxes']

function Chart({ data }) {
  const [plotData, setPlotData] = useState([]);
  const [plotLayout, setPlotLayout] = useState(layout(...labels));

  useMemo(() => {
    const pData = data.map(i => ({
      x: i.x,
      y: i.y,
      name: i.name,
      line: { width: 1 },
      marker: { size: 5, opacity: 0.8 },
      hovertemplate: '%{y:.2f}'
    }));
    setPlotData(pData);
  }, [data]);

    const updateChart = () => {
      // Generate new data and layout
      const newData = [
        {
          x: [1, 2, 3, 4, 5],
          y: [5, 4, 3, 2, 1],
          name: 'Updated Data',
          line: { width: 1 },
          marker: { size: 5, opacity: 0.8 },
          hovertemplate: '%{y:.2f}'
        }
      ];
  
      const newLayout = layout('Updated Chart', 'Updated X-axis', 'Updated Y-axis');
  
      // Update the state with the new data and layout
      setPlotData(newData);
    };
  
    return (
      <div>
        <button onClick={updateChart}>Update Chart</button>
        <ChartPlotly data={plotData} layout={plotLayout} config={config} />
      </div>
    );
  }
  
  export default Chart;