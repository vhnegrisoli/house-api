import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';

import SessionController from './controllers/SessionController';
import HouseController from './controllers/HouseController';
import User from './models/User';
import {
  UNAUTHORIZED,
  USER_NOT_AUTHORIZED,
  NOT_FOUND,
  USER_NOT_FOUND,
} from './utils/ValidationMessages';

const routes = new Router();
const upload = multer(uploadConfig);

routes.post('/sessions', SessionController.store);
routes.post('/houses', checkSession, upload.single('thumbnail'), HouseController.store);

async function checkSession(req, res, next) {
  const { user_id } = req.headers;
  if (!user_id) {
    return res.status(UNAUTHORIZED).json({ message: USER_NOT_AUTHORIZED });
  }
  const user = await User.findById(user_id);
  console.log(user);
  if (!user) {
    return res.status(NOT_FOUND).json({ message: USER_NOT_FOUND });
  }
  return next();
}

export default routes;
