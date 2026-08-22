const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  multipleStatements: true
};

async function initDatabase() {
  console.log('Connecting to MySQL server...');
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL successfully.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    console.log('Executing schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('Database schema initialized.');

    console.log('Executing seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log('Seed data inserted.');

    // Hash passwords dynamically
    const dbName = process.env.DB_NAME || 'globetrotter_db';
    await connection.changeUser({ database: dbName });

    const userHash = await bcrypt.hash('Password123', 10);
    const adminHash = await bcrypt.hash('Admin123', 10);

    await connection.query('UPDATE users SET password_hash = ? WHERE email = ?', [userHash, 'user@example.com']);
    await connection.query('UPDATE users SET password_hash = ? WHERE email = ?', [adminHash, 'admin@globetrotter.com']);

    console.log('Bcrypt password hashes updated successfully.');
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
