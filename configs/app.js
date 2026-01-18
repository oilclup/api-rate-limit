import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

export default {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  base_url: process.env.BASE_URL,
};
