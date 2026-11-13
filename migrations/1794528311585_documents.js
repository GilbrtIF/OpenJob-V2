
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * Membuat tabel documents.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('documents', {
    // Primary Key
    id: {
      type: 'varchar(50)',
      primaryKey: true,
      notNull: true,
    },

    // Foreign Key ke tabel users
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },

    // Nama asli file dari pengguna
    original_name: {
      type: 'varchar(255)',
      notNull: true,
    },

    // Nama file yang disimpan di disk
    filename: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },

    // Jenis file
    mime_type: {
      type: 'varchar(100)',
      notNull: true,
    },

    // Ukuran file dalam byte
    size: {
      type: 'integer',
      notNull: true,
    },

    // Waktu dokumen diunggah
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

/**
 * Menghapus tabel documents.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('documents');
};
