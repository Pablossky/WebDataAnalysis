function ResampledTable({ array1, array2, sampleCount }) {
    const resamplingFactor = array1.length / sampleCount;
    const resampledArray1 = [];
    const resampledArray2 = [];

    for (let i = 0; i < sampleCount; i++) {
      const index = Math.round(i * resamplingFactor);
      resampledArray1.push(array1[index].toFixed(3));
      resampledArray2.push(array2[index].toFixed(3));
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {resampledArray1.map((value, index) => (
            <tr key={index}>
              <td>{value}</td>
              <td>{resampledArray2[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  

export default ResampledTable;