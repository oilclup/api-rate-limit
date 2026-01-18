import express from 'express';
import config from './configs/app.js';
import setupExpress from './configs/express.js';
import modules from './modules/index.js'

const app = express();

setupExpress(app);

app.use('/api', modules)

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`MODE : ${config.environment} Server is listening on http://localhost:${PORT}`);
});
