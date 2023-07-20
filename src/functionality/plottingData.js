import React from 'react';

const ResampledTable = ({ array1, array2, sampleCount }) => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {array1.map((xValue, index) => (
            <tr key={index}>
              <td>{xValue.toFixed(3)}</td>
              <td>{array2[index].toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResampledTable;
