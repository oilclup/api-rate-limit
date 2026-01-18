import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';

import config from './app.js';
import corsOptions from './cors.js';

export default function setupExpress(app) {
  console.log("MODE:", config.environment);

  app.use(helmet());
  app.use(xss());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ extended: true, limit: '500mb' }));
  app.use(cookieParser());
  app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :response-time ms'));
}
