
function clearingDataText(dataToClear) {
    const text = JSON.stringify(dataToClear);
    let readyText = text.replaceAll(/["{XYxy:]/g, "")
      .replaceAll(/[,[}]/g, " ")
      .replaceAll("]", " ")
      .replaceAll(/[nameeirvuxcel]/g, "");

    return readyText;
}

const copyDataToTxt = (chartData) => {
  let textData = "X\tY\n"; 

  for (let i = 0; i < chartData.x.length; i++) {
    textData += chartData.x[i] + "\t" + chartData.y[i] + "\n";
  }

  const blob = new Blob([textData], { type: "text/plain" });
  const tempUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = tempUrl;
  link.setAttribute("download", "data.txt");
  link.click();
  window.URL.revokeObjectURL(tempUrl);
};
    

module.exports = { clearingDataText, copyDataToTxt };
