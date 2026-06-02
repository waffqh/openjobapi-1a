/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.addConstraint("applications", "fk_applications_user_id", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  pgm.addConstraint("applications", "fk_applications_job_id", {
    foreignKeys: {
      columns: "job_id",
      references: "jobs(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropConstraint("applications", "fk_applications_user_id");

  pgm.dropConstraint("applications", "fk_applications_job_id");
};
