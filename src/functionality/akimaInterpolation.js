function akimaInterpolate(x, y, numValues) {
  if (x.length !== y.length) {
    throw new Error('Input arrays x and y must have the same length.');
  }

  const n = x.length;

  if (numValues < 2 || numValues > n) {
    throw new Error('The number of output values (numValues) must be between 2 and the length of input arrays (x, y).');
  }

  const slopes = calculateSlopes(x, y);
  const step = (x[n - 1] - x[0]) / (numValues - 1);
  const interpolatedX = [];
  const interpolatedY = [];

  for (let i = 0; i < numValues; i++) {
    const interpolatedXValue = x[0] + step * i;
    const interpolatedYValue = interpolateValue(interpolatedXValue, x, y, slopes);
    interpolatedX.push(interpolatedXValue);
    interpolatedY.push(interpolatedYValue);
  }

  return { x: interpolatedX, y: interpolatedY };
}

function calculateSlopes(x, y) {
  const n = x.length;
  const slopes = new Array(n);

  slopes[0] = calculateSlope(x[0], x[1], y[0], y[1]);
  slopes[1] = calculateSlope(x[1], x[2], y[1], y[2]);
  slopes[n - 2] = calculateSlope(x[n - 2], x[n - 1], y[n - 2], y[n - 1]);
  slopes[n - 1] = calculateSlope(x[n - 3], x[n - 1], y[n - 3], y[n - 1]);

  for (let i = 2; i < n - 2; i++) {
    slopes[i] = calculateSlope(x[i - 1], x[i + 1], y[i - 1], y[i + 1]);
  }

  return slopes;
}

function calculateSlope(x0, x1, y0, y1) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  return dy / dx;
}

function interpolateValue(x, dataX, dataY, slopes) {
  const index = findIndex(x, dataX);

  const x0 = dataX[index];
  const x1 = dataX[index + 1];
  const y0 = dataY[index];
  const y1 = dataY[index + 1];
  const slope0 = slopes[index];
  const slope1 = slopes[index + 1];

  const dx = x1 - x0;
  const t = (x - x0) / dx;

  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
  const h10 = t ** 3 - 2 * t ** 2 + t;
  const h01 = -2 * t ** 3 + 3 * t ** 2;
  const h11 = t ** 3 - t ** 2;

  return y0 * h00 + slope0 * dx * h10 + y1 * h01 + slope1 * dx * h11;
}

function findIndex(x, dataX) {
  const n = dataX.length;

  if (x <= dataX[0]) {
    return 0;
  }

  if (x >= dataX[n - 1]) {
    return n - 2;
  }

  let low = 0;
  let high = n - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (x >= dataX[mid] && x < dataX[mid + 1]) {
      return mid;
    } else if (x < dataX[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  throw new Error('Could not find index for interpolation.');
}

export default akimaInterpolate;
