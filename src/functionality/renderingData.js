
import ResampledTable from './plottingData.js';

const renderData = ( chartData, originalChartData, selectedSource ) => {
    if (selectedSource === 'dataFile') {
      return (
        <div>
          {chartData.x.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>X</th>
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {chartData.x.map((xValue, index) => (
                  <tr key={index}>
                    <td>{xValue.toFixed(3)}</td>
                    <td>{chartData.y[index].toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    } else if (selectedSource === 'default') {
      return (
        <div>
          {originalChartData.x.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>X</th>
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {originalChartData.x.map((xValue, index) => (
                  <tr key={index}>
                    <td>{xValue.toFixed(3)}</td>
                    <td>{originalChartData.y[index].toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    } else if (selectedSource === 'interpolated') {
      return (
        <div>
          {originalChartData.x.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Interpolated X</th>
                  <th>Interpolated Y</th>
                </tr>
              </thead>
              <tbody>
                {originalChartData.x.map((xValue, index) => (
                  <tr key={index}>
                    <td>{xValue.toFixed(3)}</td>
                    <td>{originalChartData.y[index].toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    }
};

const renderFilteredData = (filteredChartData) => {
    if (filteredChartData.x.length > 0) {
      return (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>X</th>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              {filteredChartData.x.map((xValue, index) => (
                <tr key={index}>
                  <td>{xValue.toFixed(3)}</td>
                  <td>{filteredChartData.y[index].toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return null;
    }
};

const renderGeneratedArray = (resampledChartData, offset, sampleCount) => {
    const array1 = resampledChartData.x.slice(offset, Math.min(offset + sampleCount));
    const array2 = resampledChartData.y.slice(offset, Math.min(offset + sampleCount));

    return (
      <div>
        <ResampledTable array1={array1} array2={array2} sampleCount={sampleCount} />
      </div>
    );
};

export { renderData, renderFilteredData, renderGeneratedArray }