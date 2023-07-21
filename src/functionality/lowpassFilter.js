// Based on a RC circuit, Wikipedia

function applyLowpassFilter(data, cutoffFrequency, sampleRate) {
    const RC = 1.0 / (cutoffFrequency * 2 * Math.PI);
    const dt = 1.0 / sampleRate;
    const alpha = dt / (RC + dt);
  
    let filteredData = [];
    let previousValue = data[0];
  
    for (let i = 0; i < data.length; i++) {
      const currentValue = data[i];
      const filteredValue = alpha * currentValue + (1 - alpha) * previousValue;
      filteredData.push(filteredValue);
      previousValue = filteredValue;
    }
  
    return filteredData;
  }

  export default applyLowpassFilter;