const { taskFile } = require("./constants");
const fs = require("fs");
// Function to read tasks from file
const readTasks = () => {
  try {
    if (!fs.existsSync(taskFile)) return [];
    const data = fs.readFileSync(taskFile, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading tasks:", error);
    return [];
  }
};

module.exports = {
  readTasks,
};
