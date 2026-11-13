
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * Membuat tabel authentications.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('authentications', {
    id: { type: 'varchar(50)',
      primaryKey: true,
      notNull: true
    },
    // Token autentikasi
    token: {
      type: 'text',
      notNull: true,
      unique: true,
    },

    // Foreign Key ke tabel users
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },

    // Waktu token dibuat
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

/**
 * Menghapus tabel authentications.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('authentications');
};
