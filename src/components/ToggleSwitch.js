// ToggleSwitch.js
import React from 'react';
import './ToggleSwitchStyle.css';

const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <div className="toggle-switch-container">
      <label className="toggle-switch-label">{label}</label>
      <div className={`toggle-switch ${checked ? 'checked' : ''}`} onClick={() => onChange(!checked)}>
        <div className="toggle-switch-thumb" />
      </div>
    </div>
  );
};

export default ToggleSwitch;
