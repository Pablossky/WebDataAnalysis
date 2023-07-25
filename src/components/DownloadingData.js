import React from 'react';
import { Popup, Dropdown } from 'semantic-ui-react';
import '../App.css';
import '../functionality/dataManagement';
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';

const dataManagement = require('../functionality/dataManagement.js');

const DownloadingData = ({ data1, data2, data3, buttonWidth }) => {
  const handleDownloadResampled = () => {
    dataManagement.copyDataToTxt(data1);
  };

  const handleDownloadOriginal = () => {
    dataManagement.copyDataToTxt(data2);
  };

  const handleDownloadFiltered = () => {
    dataManagement.copyDataToTxt(data3);
  };

  const handleCopyResampled = () => {
    navigator.clipboard.writeText(dataManagement.clearingDataText(data1));
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(dataManagement.clearingDataText(data2));
  };

  const handleCopyFiltered = () => {
    navigator.clipboard.writeText(dataManagement.clearingDataText(data3));
  };

  const downloadOptions = [
    // options remain the same
  ];

  const buttonStyle = {
    width: buttonWidth,
  };

  // Style to center the button vertically and horizontally
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div>
      {/* Center the button */}
      <div style={containerStyle}>
        <Dropdown
          className="FunctionalButton"
          text="Download/Copy Data"
          button
          fluid
          floating
          options={downloadOptions}
          style={buttonStyle}
        />
      </div>
    </div>
  );
};

export default DownloadingData;
