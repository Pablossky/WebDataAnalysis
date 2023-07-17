import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';

const DataBox = ({ value, name }) => {
  return (
    <div
      className="Box"
      style={{
        width: '350px',
        height: '500px',
        overflow: 'auto',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        marginLeft: '10px',
        textAlign: 'center'
      }}
    >
      <h1>{name}</h1>
      {value}
    </div>
  );
};

export default DataBox;
