import React from 'react';

const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label style={{ marginRight: '10px' }}>{label}</label>
      <div className="ui toggle checkbox">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <label></label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
