const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const corsOptions = require('./config/cors');
const config = require('./config/env');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload files
const uploadsPath = path.join(__dirname, '../', config.uploadDir);
app.use('/uploads', express.static(uploadsPath));

// OpenAPI / Swagger Documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
  console.warn('Swagger specification load warning:', err.message);
}

// API Routes Versioning (/api/v1)
app.use('/api/v1', apiRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GlobeTrotter Backend API',
    version: '1.0.0',
    documentation: '/api-docs',
    healthCheck: '/api/v1/health'
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
