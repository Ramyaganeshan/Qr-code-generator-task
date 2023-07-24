const fs = require("fs");

const dataFilePath = "data.json";
let submittedData = {};

function readDataFromFile() {
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data file:", err);
    } else {
      submittedData = JSON.parse(data);
    }
  });
}

function writeDataToFile() {
  fs.writeFile(
    dataFilePath,
    JSON.stringify(submittedData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing data file:", err);
      } else {
        console.log("Data file updated successfully!");
      }
    }
  );
}

module.exports = { readDataFromFile, writeDataToFile, submittedData };
