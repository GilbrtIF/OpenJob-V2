/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * Membuat tabel bookmarks.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('bookmarks', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
      notNull: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"jobs"',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  // Satu user hanya boleh menyimpan satu job satu kali
  pgm.addConstraint('bookmarks', 'bookmarks_user_id_job_id_unique', {
    unique: ['user_id', 'job_id'],
  });
};

/**
 * Menghapus tabel bookmarks.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('bookmarks');
};