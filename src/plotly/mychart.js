import React, { useMemo } from "react";
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

const labels = ['Chart', 'xAxis', 'yAxis']

function Chart({data}){

    const plotData = useMemo(() => {

      const pData = data.map(i => {
        return {
          x: i.x,
          y: i.y,
          name: i.name,
          line: {width: 1},
          marker: {size: 5, opacity: 0.8},
          hovertemplate: '%{y:.2f}',
        }
      })
      return pData
    }, [data]);

    return(
        <ChartPlotly data={plotData} layout={layout(...labels)} config={config}/>
    )
}

export default Chart