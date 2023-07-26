const applySubtraction = (data, value) => {
    const { x, y } = data;
    const subtractedY = y.map((yValue) => yValue - value);
    return { name: 'Subtracted', x, y: subtractedY };
  };

  export default applySubtraction;