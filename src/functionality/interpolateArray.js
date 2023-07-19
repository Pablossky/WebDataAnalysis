import akimaInterpolate from './akimaInterpolation';



const numeric = require('numeric');

function interpolateArray(x, y, numValues, method, offset) {
    let interpolatedX, interpolatedY;

    if (method === 'linear') {
      interpolatedX = [];
      interpolatedY = [];

      for (let i = 0; i < numValues; i++) {
        const fraction = i / (numValues - 1);
        const index = Math.floor(fraction * (x.length - 1));
        const dx = fraction * (x[x.length - 1] - x[0]);
        const interpolatedXValue = x[0] + dx;
        const interpolatedYValue = y[index + offset] + (y[index + offset + 1] - y[index + offset]) * (dx - x[index + offset]) / (x[index + offset + 1] - x[index + offset]);
        interpolatedX.push(interpolatedXValue);
        interpolatedY.push(interpolatedYValue);
      }
    } else if (method === 'cubic') {
      const interpolator = numeric.spline(x, y, 'cubic');

      interpolatedX = numeric.linspace(x[0], x[x.length - 1], numValues);
      interpolatedY = interpolatedX.map((value) => interpolator.at(value));

    } else if (method === 'akima') {
      return akimaInterpolate(x, y, numValues, offset);
    }
    

    return { x: interpolatedX, y: interpolatedY };
  }

  export default interpolateArray;