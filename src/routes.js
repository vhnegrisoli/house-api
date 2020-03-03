import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';

import SessionController from './controllers/SessionController';
import HouseController from './controllers/HouseController';
import User from './models/User';

const routes = new Router();
const upload = multer(uploadConfig);

routes.get('/', (req, res) => {
  return res.json({ message: 'Ok' });
});

routes.post('/sessions', SessionController.store);
routes.post('/houses', checkSession, upload.single('thumbnail'), HouseController.store);

async function checkSession(req, res, next) {
  const { user_id } = req.headers;
  if (!user_id) {
    return res.status(401).json({ message: 'Não autenticado.' });
  }
  const user = await User.findById(user_id);
  console.log(user);
  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado.' });
  }
  return next();
}

export default routes;
