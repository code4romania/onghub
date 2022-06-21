/* 
    Configuration for migrations

    Note: For NODE_ENV=development, to run migrations in remotely, will need to manually replace the variables in .env
    or directly here. 
**/

module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: ['src/migrations'],
  },
  ssl:
    process.env.NODE_ENV === 'local' // enable SSL for REMOTE deployment, and disable for local to let migrations work
      ? false
      : {
          rejectUnauthorized: false,
        },
};
