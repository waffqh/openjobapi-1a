import pool from "../config/database.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
);

const addBookmark = async (req) => {
  const jobId = req.params.id;
  const userId = req.user.id;

  const job = await pool.query("SELECT id FROM jobs WHERE id = $1", [jobId]);

  if (!job.rows.length) {
    throw new Error("job tidak ditemukan");
  }

  const existing = await pool.query(
    "SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2",
    [userId, jobId],
  );

  if (existing.rows.length) {
    throw new Error("Bookmark sudah ada");
  }

  const id = `bookmark-${nanoid(16)}`;

  const query = {
    text: `
      INSERT INTO bookmarks(
        id,
        user_id,
        job_id
      )
      VALUES($1, $2, $3)
      RETURNING id
    `,
    values: [id, userId, jobId],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getBookmarks = async () => {
  const result = await pool.query("SELECT * FROM bookmarks");

  return result.rows;
};

const deleteBookmark = async (id) => {
  const existing = await pool.query(
    `SELECT * FROM bookmarks WHERE job_id = $1`,
    [id],
  );
  if (!existing.rows.length) {
    throw new Error("Bookmark tidak ditemukan");
  }
  await pool.query("DELETE FROM bookmarks WHERE job_id = $1", [id]);
};

const getBookmarkById = async (id) => {
  const result = await pool.query(`SELECT * FROM bookmarks WHERE id = $1`, [
    id,
  ]);
  if (!result.rows.length) {
    throw new Error("Bookmark tidak ditemukan");
  }
  return result.rows[0];
};

export default {
  addBookmark,
  getBookmarks,
  deleteBookmark,
  getBookmarkById,
};
