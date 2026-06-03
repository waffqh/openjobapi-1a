import pool from "../config/database.js";
import { nanoid } from "nanoid";

const addApplication = async ({ user_id, job_id, status }) => {
  const id = `application-${nanoid(16)}`;

  const query = {
    text: `
      INSERT INTO applications(
        id,
        user_id,
        job_id,
        status
      )
      VALUES($1, $2, $3, $4)
      RETURNING id
    `,
    values: [id, user_id, job_id, status],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getApplications = async () => {
  const result = await pool.query("SELECT * FROM applications");

  return result.rows;
};

const getApplicationsById = async (id) => {
  const result = await pool.query("SELECT * FROM applications WHERE id =$1", [
    id,
  ]);

  return result.rows[0];
};

const getApplicationsByUserId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM applications WHERE user_id =$1",
    [id],
  );

  return result.rows;
};

const getApplicationsByJobId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM applications WHERE job_id =$1",
    [id],
  );

  return result.rows;
};

const updateApplicationsById = async (id, data) => {
  const existing = await pool.query(
    `SELECT * FROM applications WHERE id = $1`,
    [id],
  );
  if (!existing.rows.length) {
    throw new Error("Applications tidak ditemukan");
  }

  const oldData = existing.rows[0];

  const result = await pool.query(
    `UPDATE applications SET
      user_id = $1,
      job_id = $2,
      status = $3
     WHERE id = $4
     RETURNING *`,
    [
      data.user_id ?? oldData.user_id,
      data.job_id ?? oldData.job_id,
      data.status ?? oldData.status,
      id,
    ],
  );

  return result.rows;
};

const deleteApplicationsById = async (id) => {
  const existing = await pool.query(
    `SELECT * FROM applications WHERE id = $1`,
    [id],
  );
  if (!existing.rows.length) {
    throw new Error("Applications tidak ditemukan");
  }
  await pool.query("DELETE FROM applications WHERE id = $1", [id]);
};

export default {
  addApplication,
  getApplications,
  getApplicationsById,
  getApplicationsByUserId,
  getApplicationsByJobId,
  updateApplicationsById,
  deleteApplicationsById,
};
