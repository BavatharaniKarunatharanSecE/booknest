const fs = require('fs');
const path = require('path');

// Helper function to read JSON files
const readDataFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

// Helper function to write JSON files
const writeDataToFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
};

// Generate new ID
const generateNewId = (dataArray) => {
  return dataArray.length > 0 ? Math.max(...dataArray.map(item => item.id)) + 1 : 1;
};

module.exports = {
  readDataFromFile,
  writeDataToFile,
  generateNewId
};