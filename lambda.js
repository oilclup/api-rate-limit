import serverless from 'serverless-http';
import express from 'express';
import setupExpress from './configs/express.js';
import modules from './modules/index.js';

const app = express();

setupExpress(app);

app.get('/health', (req, res) => {
  console.log('Health check called');
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', modules);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API Rate Limit Service',
    endpoints: ['/health', '/api']
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export const handler = serverless(app, {
  binary: false,
  request(request, event, context) {
    console.log('Request:', JSON.stringify(event, null, 2));
  }
});