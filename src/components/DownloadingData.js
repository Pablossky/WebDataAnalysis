import '../App.css';
import React from 'react';
import "../functionality/dataManagement";
import 'semantic-ui-css/semantic.min.css';
import 'toolcool-range-slider';

const dataManagement = require("../functionality/dataManagement.js");

const DownloadingData = ({ data1, data2 }) => {
    return (
        <div className="Data2">
              <div className="Space"></div>
                <button
                  className="FunctionalButton"
                  onClick={() => dataManagement.copyDataToTxt(data1)}
                >
                  Download resampled data in .txt
                </button>
                <button
                  className="FunctionalButton"
                  onClick={() => dataManagement.copyDataToTxt(data2)}
                >
                  Download original data in .txt
                </button>
                <div className="Space"></div>
                <button
                  className="FunctionalButton"
                  onClick={() =>
                    navigator.clipboard.writeText(dataManagement.clearingDataText(data1))
                  }
                >
                  Copy resampled data to clipboard
                </button>
                <button
                  className="FunctionalButton"
                  onClick={() =>
                    navigator.clipboard.writeText(dataManagement.clearingDataText(data2))
                  }
                >
                  Copy original data to clipboard
                </button>
              </div>
    )}

export default DownloadingData;