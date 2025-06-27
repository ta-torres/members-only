const pool = require("../db/db");
const bcrypt = require("bcryptjs");

const userModel = {
  create: async (userData) => {
    const { firstName, lastName, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await pool.query("BEGIN");

      const userResult = await pool.query(
        "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
        [firstName, lastName, email, hashedPassword]
      );

      const userId = userResult.rows[0].id; // get the generated user id from the database

      // every new user is a guest by default
      await pool.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [userId, 1]
      );

      await pool.query("COMMIT");
      return userId;
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  },

  updateUserRole: async (userId, roleId) => {
    /* start transaction
    remove current role
    add new one
    end transaction
    */
    try {
      await pool.query("BEGIN");

      await pool.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);

      await pool.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [userId, roleId]
      );

      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  },

  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      `
      SELECT u.*, 
             ARRAY_AGG(r.name) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.password_hash, u.created_at
    `,
      [id]
    );

    return result.rows[0];
  },

  emailExists: async (email) => {
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows.length > 0;
  },
};

module.exports = userModel;
