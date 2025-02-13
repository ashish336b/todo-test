const express = require("express");
const { writeTasks } = require("./helper/writeTask");
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/todo/add", (req, res) => {
  const { task } = req.body;
  let task_to_add = [];

  task_to_add.push(task);
  writeTasks(task_to_add);

  res.status(201).json({ message: "Task added successfully." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
