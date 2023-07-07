
function clearingDataText(dataToClear) {
    const text = JSON.stringify(dataToClear);
    let readyText = text.replaceAll(/["{XY:]/g, "")
      .replaceAll(/[,[]/g, " ")
      .replaceAll("}", "\n")
      .replaceAll("]", "");

    return readyText;
}

function copyDataToTxt(data) {
    const element = document.createElement("a");
    const file = new Blob([clearingDataText(data)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "data.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
    

module.exports = { clearingDataText, copyDataToTxt };
