#! /usr/bin/env node

require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  console.log("Seeding database...");

  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://username:password@localhost:5432/database_name",
  });

  try {
    await client.connect();

    await client.query(`
      TRUNCATE users, messages, user_roles RESTART IDENTITY CASCADE;
    `);

    const johnPassword = await bcrypt.hash("password", 10);
    const janePassword = await bcrypt.hash("member", 10);
    const adminPassword = await bcrypt.hash("admin", 10);
    const guestPassword = await bcrypt.hash("guest", 10);

    const userInserts = await client.query(
      `
      INSERT INTO users (first_name, last_name, email, password_hash, created_at) VALUES 
      ('John', 'Doe', 'john@example.com', $1, NOW()),
      ('Jane', 'Smith', 'member@example.com', $2, NOW()),
      ('Admin', 'User', 'admin@example.com', $3, NOW()),
      ('Guest', 'User', 'guest@example.com', $4, NOW())
      RETURNING id;
    `,
      [johnPassword, janePassword, adminPassword, guestPassword]
    );

    // Assign roles (assuming roles already exist from schema.sql)
    // User 1 (John) - guest
    // User 2 (Jane) - member
    // User 3 (Admin) - admin
    // User 4 (Guest) - guest
    await client.query(`
      INSERT INTO user_roles (user_id, role_id) VALUES 
      (1, 1),
      (2, 2),
      (3, 3),
      (4, 1);
    `);

    await client.query(`
      INSERT INTO messages (title, content, user_id, created_at) VALUES 
      ('Welcome to the Club!', 'This is our first message. Only members can see who wrote this!', 2, NOW() - INTERVAL '3 days'),
      ('Public Announcement', 'This message is visible to everyone, but only members know I wrote it.', 1, NOW() - INTERVAL '2 days'),
      ('Admin Notice', 'Important updates for all club members. New features coming soon!', 3, NOW() - INTERVAL '1 day'),
      ('Secret Meeting', 'Next club gathering is scheduled for next Friday. Members only!', 2, NOW() - INTERVAL '12 hours'),
      ('Anonymous Thoughts', 'Sometimes the best posts are the ones where you don''t know who wrote them...', 1, NOW() - INTERVAL '6 hours'),
      ('Club Rules', 'Remember to follow the club guidelines when posting messages.', 3, NOW() - INTERVAL '2 hours'),
      ('Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Integer sit amet semper nisi.', 1, NOW() - INTERVAL '1 hour');
    `);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
    console.log("Database seeded successfully!");
  }
}

main();
