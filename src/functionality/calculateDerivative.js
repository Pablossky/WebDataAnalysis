export function calculateDerivative(arr) {
    const derivative = [];
    for (let i = 1; i < arr.length; i++) {
      derivative.push(arr[i] - arr[i - 1]);
    }
    return derivative;
  }
  