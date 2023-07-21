function akimaInterpolate(x, y, xDesired) {
  const n = x.length;
  const m = y.length;

  if (n !== m || n < 4) {
    throw new Error("Invalid input data. The number of x and y values should be the same and at least 4.");
  }

  // Calculate the slopes (t) at each data point using the Akima method
  const t = new Array(n);
  for (let i = 0; i < n; i++) {
    const dx = x[i + 1] - x[i];
    const dy = y[i + 1] - y[i];
    t[i] = dy / dx;
  }

  // Interpolate the desired y values using the Akima method
  const interpolatedX = xDesired.slice(); // Create a copy of xDesired
  const interpolatedY = [];
  for (let i = 0; i < xDesired.length; i++) {
    const xd = xDesired[i];

    let index = 0;
    while (index < n - 1 && xd > x[index + 1]) {
      index++;
    }

    const dx = x[index + 1] - x[index];
    const dy = y[index + 1] - y[index];
    const m0 = t[index];
    const m1 = t[index + 1];

    const a = m1 + m0 - 2 * dy / dx;
    const b = 3 * dy / dx - 2 * m0 - m1;
    const c = m0;
    const d = y[index];

    const ti = (xd - x[index]) / dx;
    const yd = a * ti ** 3 + b * ti ** 2 + c * ti + d;
    interpolatedY.push(yd);
  }

  return { x: interpolatedX, y: interpolatedY };
}

export default akimaInterpolate;