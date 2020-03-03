import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';

class App {
  constructor() {
    mongoose.connect('mongodb://localhost:27017/devhouse_api',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;