import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/upload";

import SessionController from "./controllers/SessionController";
import HouseController from "./controllers/HouseController";
import DashboardController from "./controllers/DashboardController";
import ReserveController from "./controllers/ReserveController";
import User from "./models/User";
import {
  UNAUTHORIZED,
  USER_NOT_AUTHORIZED,
  USER_NOT_FOUND,
  BAD_REQUEST
} from "./utils/ValidationMessages";

const routes = new Router();
const upload = multer(uploadConfig);

async function checkSession(req, res, next) {
  const { user_id } = req.headers;
  if (!user_id) {
    return res.status(UNAUTHORIZED).json({ message: USER_NOT_AUTHORIZED });
  }
  const user = await User.findById(user_id);
  if (!user) {
    return res.status(BAD_REQUEST).json({ message: USER_NOT_FOUND });
  }
  return next();
}

routes.post("/sessions", SessionController.store);

routes.post(
  "/houses",
  checkSession,
  upload.single("thumbnail"),
  HouseController.store
);
routes.get("/houses", checkSession, HouseController.index);
routes.get("/houses/:id", checkSession, HouseController.show);
routes.put(
  "/houses/:id",
  checkSession,
  upload.single("thumbnail"),
  HouseController.update
);
routes.delete("/houses/:id", checkSession, HouseController.destroy);

routes.get("/dashboard", checkSession, DashboardController.show);

routes.post("/reserve", checkSession, ReserveController.store);
routes.put("/reserve/:id", checkSession, ReserveController.update);
routes.get("/reserves", checkSession, ReserveController.index);
routes.get("/reserves/:id", checkSession, ReserveController.show);
routes.delete("/reserves/:id", checkSession, ReserveController.destroy);

export default routes;
