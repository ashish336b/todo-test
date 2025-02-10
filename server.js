require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Node.js server is running!");
});

// Example route to get all users (Assuming a 'users' table exists)
app.get("/users", async (req, res) => {
  try {
    const users = await db("users").select("*");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
