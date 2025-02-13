const { taskFile } = require("./constants");
const fs = require("fs");
// Function to write tasks to file
const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error writing tasks:", error);
  }
};

module.exports = {
  writeTasks,
};
