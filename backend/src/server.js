const app = require('./app');
const config = require('./config/env');
const { pool } = require('./config/database');

async function startServer() {
  try {
    // Test MySQL connection pool
    const connection = await pool.getConnection();
    console.log(`Connected to MySQL database: '${config.db.database}' on ${config.db.host}:${config.db.port}`);
    connection.release();

    const server = app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(` GlobeTrotter Backend Server running on port ${config.port}`);
      console.log(` API Base URL:      http://localhost:${config.port}/api/v1`);
      console.log(` API Health Check:  http://localhost:${config.port}/api/v1/health`);
      console.log(` Swagger API Docs:  http://localhost:${config.port}/api-docs`);
      console.log(` Environment:       ${config.nodeEnv}`);
      console.log(`====================================================`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n[ERROR] Port ${config.port} is already in use by another process.`);
        console.error(`To resolve this, kill the process using port ${config.port} or specify a different PORT in your .env file.\n`);
      } else {
        console.error('Server execution error:', error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error.message);
    console.error('Please verify your MySQL database is running and credentials in .env are correct.');
    process.exit(1);
  }
}

startServer();
