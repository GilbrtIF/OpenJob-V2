/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * Menambahkan kolom owner_id ke tabel jobs.
 * Nullable agar migration tetap berhasil pada database
 * yang sudah berisi job lama (mis. database V1 milik penguji).
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.addColumn('jobs', {
    owner_id: {
      type: 'varchar(50)',
      references: '"users"',
      onDelete: 'SET NULL',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumn('jobs', 'owner_id');
};