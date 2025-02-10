const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

const TASKS_FILE = path.join(__dirname, "tasks.json");

// Function to read tasks from file
const readTasks = () => {
  try {
    if (!fs.existsSync(TASKS_FILE)) return [];
    const data = fs.readFileSync(TASKS_FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading tasks:", error);
    return [];
  }
};

// Function to write tasks to file
const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error writing tasks:", error);
  }
};

// 📌 **POST /todo/add** → Add a new task
app.post("/todo/add", (req, res) => {
  const { task } = req.body;

  // 🛑 Validate request

  let tasks = readTasks();

  // 🛑 Check for duplicates
  if (tasks.includes(task)) {
    return res.status(409).json({ error: "Task already exists." });
  }

  // ✅ Add task and save
  tasks.push(task);
  writeTasks(tasks);

  res.status(201).json({ message: "Task added successfully." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
