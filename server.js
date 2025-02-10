require("dotenv").config();
const express = require("express");
const db = require("./database/connection");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Node.js server with Knex is running!");
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
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

app.put("/users/update-bulk", async (req, res) => {
  const trx = await db.transaction(); // Start a transaction
  const requestId = Date.now(); // Unique identifier for each request
  console.log(`🚀 Request ${requestId} STARTED at ${new Date().toISOString()}`);
  try {
    let ids = [];
    if (req.query.name === "ashish") {
      ids = Array.from({ length: 66 }, (_, i) => i + 11);
    } else {
      ids = Array.from({ length: 66 }, (_, i) => i + 1);
    }
    const users = await trx("users")
      .select("*")
      .whereIn("id", ids)
      .orderBy("id")
      //   .orderByRaw("RANDOM()")
      .forUpdate();

    await sleep(100);
    if (users.length === 0) {
      console.log(`❌ Request ${requestId} ROLLED BACK (No users found)`);

      await trx.rollback(); // Rollback transaction if no users found
      return res.status(404).json({ message: "No users found to update" });
    }

    // Prepare bulk update data
    const updates = users.map((user) => ({
      id: user.id,
      name: `Aashish updated 1 ${req.query.name} ${requestId}}`,
      email: user.email,
      updated_at: new Date(),
    }));
    // Perform bulk update within the transaction
    for (const user of updates) {
      await trx("users").where({ id: user.id }).update(user);
    }

    await trx.commit(); // Commit transaction if all updates succeed
    console.log(
      `✅ Request ${requestId} COMMITTED at ${new Date().toISOString()}`
    );

    res.json({
      message: "Successfully updated 150 users",
      updatedUsers: updates,
    });
  } catch (error) {
    console.log(
      `❌ Request ${requestId} ROLLED BACK due to ERROR at ${new Date().toISOString()} ---- ${
        error.message
      }`
    );

    await trx.rollback(); // Rollback transaction in case of an error
    res.status(500).json({ error: error.message });
  }
});

app.post("/simulate-deadlock", async (req, res) => {
  const { transaction } = req.query; // transaction=1 or transaction=2
  const trx = await db.transaction(); // Start a transaction
  const requestId = Date.now();

  console.log(`🚀 Transaction ${transaction} STARTED - ${requestId}`);

  try {
    if (transaction === "1") {
      // Transaction 1: Lock user 1 first, then try to lock user 2
      await trx("users").where({ id: 1 }).forUpdate();
      console.log(`🔒 Transaction 1 locked User 1`);

      await sleep(5000); // Simulate delay to increase deadlock probability

      await trx("users").where({ id: 2 }).forUpdate();
      console.log(`🔒 Transaction 1 locked User 2`);
    } else if (transaction === "2") {
      // Transaction 2: Lock user 2 first, then try to lock user 1
      await trx("users").where({ id: 1 }).forUpdate();
      await trx("users").where({ id: 2 }).forUpdate();
      console.log(`🔒 Transaction 2 locked User 2`);

      await sleep(5000); // Simulate delay to increase deadlock probability

      console.log(`🔒 Transaction 2 locked User 1`);
    } else {
      return res.status(400).json({ error: "Invalid transaction number" });
    }

    await trx.commit();
    console.log(`✅ Transaction ${transaction} COMMITTED - ${requestId}`);
    res.json({ message: `Transaction ${transaction} committed successfully` });
  } catch (error) {
    console.log(
      `❌ Transaction ${transaction} ROLLED BACK due to deadlock - ${error.message}`
    );
    await trx.rollback();
    res
      .status(500)
      .json({ error: `Transaction ${transaction} failed: ${error.message}` });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
