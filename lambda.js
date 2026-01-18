import serverless from 'serverless-http';
import express from 'express';
import setupExpress from './configs/express.js';
import modules from './modules/index.js';

const app = express();

// Setup Express middleware
setupExpress(app);

// Routes
app.use('/api', modules);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Export Lambda handler
export const handler = serverless(app);