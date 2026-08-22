const config = require('./env');

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // Allow exact match or localhost dev origins
    if (origin === config.frontendUrl || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    return callback(null, true); // Permissive in dev, configurable for production
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = corsOptions;
