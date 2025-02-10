/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();

  // Generate 1000 fake users
  for (let k = 0; k < 100; k++) {
    const users = [];

    for (let i = 0; i < 10; i++) {
      users.push({
        name: `Aashish ${k}${i}`,
        email: `ashish${k}${i}${i}@example.com`,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Insert into database
    await knex("users").insert(users);
  }
};
