import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import os from 'os';
import swagger from 'swagger-ui-express';
import configs from './configs';
import router from './routes';

// Express App
const app: Application = express();
const port: number = configs.port || 8080;

// const swaggerDocument = require('../swagger/swagger.yaml');

const ip =
  os.networkInterfaces()['wlan0']?.[0].address ||
  os.networkInterfaces()['eth0']?.[0].address;

const corsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'X-Refresh-Token',
    'Authorization',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  origin: true,
  credentials: true
};

// Middleware
// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));
app.use(router);

// Express Server
app.listen(port, () => {
  console.log(`Backend server is listening on http://${ip}:${configs.port}`);
  console.log('Press CTRL+C to stop the server.');
});

export default app;
