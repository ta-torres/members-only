const pool = require("../db/db");

const messageModel = {
  getAllMessages: async () => {
    const result = await pool.query(`
      SELECT m.id, m.title, m.content, m.created_at,
             u.first_name, u.last_name
      FROM messages m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
    `);

    return result.rows;
  },

  deleteById: async (id) => {
    const result = await pool.query(
      "DELETE FROM messages WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },
};

module.exports = messageModel;
