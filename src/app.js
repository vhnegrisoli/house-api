import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

class App {
  constructor() {
    mongoose.connect('mongodb://localhost:27017/devhouse_api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
