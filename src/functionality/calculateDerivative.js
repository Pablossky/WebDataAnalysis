function calculateDerivative(array) {
    const derivative = [];
    for (let i = 1; i < array.length; i++) {
      derivative.push(array[i] - array[i - 1]);
    }
    return derivative;
  }

  export default calculateDerivative;
  