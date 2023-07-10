import React from 'react';

function ResampledTable({ array1, array2, sampleCount }) {
  const resamplingFactor = array1.length / sampleCount;
  const resampledArray1 = [];
  const resampledArray2 = [];

  for (let i = 0; i < sampleCount; i++) {
    const index = Math.round(i * resamplingFactor);
    resampledArray1.push(array1[index]);
    resampledArray2.push(array2[index]);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Array 1</th>
          <th>Array 2</th>
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
