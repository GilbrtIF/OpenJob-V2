/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * Membuat tabel users.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('users', {
    // ID dibuat oleh aplikasi menggunakan nanoid
    id: {
      type: 'varchar(50)',
      primaryKey: true,
      notNull: true,
    },

    // Nama pengguna
    name: {
      type: 'varchar(100)',
      notNull: true,
    },

    // Email harus unik
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },

    // Menyimpan password yang sudah di-hash
    password: {
      type: 'text',
      notNull: true,
    },

    role: {
      type: 'varchar(20)',
      notNull: true,
      default: 'user',
    },

    // Waktu akun dibuat
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },

    // Waktu akun terakhir diperbarui
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

/**
 * Menghapus tabel users.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('users');
};