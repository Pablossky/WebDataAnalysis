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
    {
      key: 'downloadResampled',
      text: 'Download resampled data in .txt',
      onClick: handleDownloadResampled,
    },
    {
      key: 'downloadOriginal',
      text: 'Download original data in .txt',
      onClick: handleDownloadOriginal,
    },
    {
      key: 'downloadFiltered',
      text: 'Download filtered data in .txt',
      onClick: handleDownloadFiltered,
    },
    {
      key: 'copyResampled',
      text: 'Copy resampled data to clipboard',
      onClick: handleCopyResampled,
    },
    {
      key: 'copyOriginal',
      text: 'Copy original data to clipboard',
      onClick: handleCopyOriginal,
    },
    {
      key: 'copyFiltered',
      text: 'Copy filtered data to clipboard',
      onClick: handleCopyFiltered,
    },
  ];

  const buttonStyle = {
    width: buttonWidth,
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div>
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
