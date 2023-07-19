function akimaInterpolate(x, y, numValues, offset) {
    const n = x.length;
    const interpolatedX = [];
    const interpolatedY = [];
  
    // Calculate slopes
    const slopes = [];
    for (let i = 0; i < n - 1; i++) {
      const slope = (y[i + 1] - y[i]) / (x[i + 1] - x[i]);
      slopes.push(slope);
    }
  
    // Interpolate
    for (let i = 0; i < numValues; i++) {
      const fraction = i / (numValues - 1);
      const interpolatedXValue = x[0] + fraction * (x[n - 1] - x[0]);
  
      // Find the interval
      let index = 0;
      for (let j = 0; j < n - 1; j++) {
        if (interpolatedXValue >= x[j] && interpolatedXValue <= x[j + 1]) {
          index = j;
          break;
        }
      }
  
      // Calculate weights
      const dx1 = interpolatedXValue - x[index];
      const dx2 = x[index + 1] - interpolatedXValue;
  
      const t1 = Math.abs(slopes[index + 1] - slopes[index]);
      const t2 = Math.abs(slopes[index + 2] - slopes[index + 1]);
      const t3 = Math.abs(slopes[index] - slopes[index - 1]);
      const t4 = Math.abs(slopes[index - 1] - slopes[index - 2]);
  
      const w1 = t1 * t3;
      const w2 = t2 * t4;
  
      let s;
      if (w1 + w2 === 0) {
        s = (slopes[index - 1] + slopes[index]) / 2;
      } else {
        s = (w2 * slopes[index - 1] + w1 * slopes[index]) / (w1 + w2);
      }
  
      // Perform interpolation
      const interpolatedYValue =
        y[index] +
        (dx1 * (2 * t1 + t2) * (3 * dx2 - 2 * dx1) * (dx2 * dx2)) / (x[index + 1] - x[index]) +
        (dx2 * (2 * t2 + t1) * (3 * dx1 - 2 * dx2) * (dx1 * dx1)) / (x[index + 1] - x[index]) +
        offset;
  
      interpolatedX.push(interpolatedXValue);
      interpolatedY.push(interpolatedYValue);
    }
  
    return { x: interpolatedX, y: interpolatedY };
  }
  
  export default akimaInterpolate;
  