/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * Membuat tabel jobs.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
      notNull: true,
    },
    company_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"categories"',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    job_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    experience_level: {
      type: 'varchar(50)',
      notNull: true,
    },
    location_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    location_city: {
      type: 'varchar(100)',
    },
    salary_min: {
      type: 'integer',
    },
    salary_max: {
      type: 'integer',
    },
    is_salary_visible: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'open',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

/**
 * Menghapus tabel jobs.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('jobs');
};