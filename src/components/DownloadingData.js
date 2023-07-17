import React from 'react';
import { Button } from 'semantic-ui-react';
import '../App.css';
import '../functionality/dataManagement';
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';

const dataManagement = require('../functionality/dataManagement.js');

const DownloadingData = ({ data1, data2, data3 }) => {
  return (
    <div className="Data2">
      <div className="Space"></div>
      <Button
        className="FunctionalButton"
        onClick={() => dataManagement.copyDataToTxt(data1)}
      >
        Download resampled data in .txt
      </Button>
      <Button
        className="FunctionalButton"
        onClick={() => dataManagement.copyDataToTxt(data2)}
      >
        Download original data in .txt
      </Button>
      <Button
        className="FunctionalButton"
        onClick={() => dataManagement.copyDataToTxt(data3)}
      >
        Download filtered data in .txt
      </Button>
      <div className="Space"></div>
      <Button
        className="FunctionalButton"
        onClick={() =>
          navigator.clipboard.writeText(dataManagement.clearingDataText(data1))
        }
      >
        Copy resampled data to clipboard
      </Button>
      <Button
        className="FunctionalButton"
        onClick={() =>
          navigator.clipboard.writeText(dataManagement.clearingDataText(data2))
        }
      >
        Copy original data to clipboard
      </Button>
      <Button
        className="FunctionalButton"
        onClick={() =>
          navigator.clipboard.writeText(dataManagement.clearingDataText(data3))
        }
      >
        Copy filtered data to clipboard
      </Button>
    </div>
  );
};

export default DownloadingData;
