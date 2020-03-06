import * as Yup from "yup";
import Reserve from "../models/Reserve";
import House from "../models/House";
import User from "../models/User";
import {
  BAD_REQUEST,
  NOT_ENOUGH_FIELDS,
  HOUSE_UNAVALIABLE,
  FORBIDDEN,
  DELETED_SUCCESS,
  USER_FORBIDDEN,
  RESERVE_NOT_FOUND
} from "../utils/ValidationMessages";

class ReserveController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.string().required(),
      house_id: Yup.string().required()
    });
    const { date, house_id } = req.body;
    const { user_id } = req.headers;
    if (!(await schema.isValid(req.body))) {
      return res.status(BAD_REQUEST).json({ message: NOT_ENOUGH_FIELDS });
    }
    const house = await House.findById(house_id);
    const user = await User.findById(user_id);
    if (String(house.user) === String(user._id)) {
      return res.status(FORBIDDEN).json({ message: USER_FORBIDDEN });
    }
    if (!house.status) {
      return res.status(BAD_REQUEST).json({ message: HOUSE_UNAVALIABLE });
    }
    const reserve = await Reserve.create({
      user: user_id,
      house: house_id,
      date
    });
    await reserve
      .populate("house")
      .populate("user")
      .execPopulate();
    return res.json(reserve);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      date: Yup.string().required(),
      house_id: Yup.string().required()
    });
    const { date, house_id } = req.body;
    const { user_id } = req.headers;
    const { id } = req.params;
    const house = await House.findById(house_id);
    const user = await User.findById(user_id);
    if (!(await schema.isValid(req.body))) {
      return res.status(BAD_REQUEST).json({ message: NOT_ENOUGH_FIELDS });
    }
    if (String(house.user) === String(user._id)) {
      return res.status(FORBIDDEN).json({ message: USER_FORBIDDEN });
    }
    if (!house.status) {
      return res.status(BAD_REQUEST).json({ message: HOUSE_UNAVALIABLE });
    }
    const reserve = await Reserve.updateOne(
      { _id: id },
      {
        user: user._id,
        house: house._id,
        date
      }
    );
    return res.json(reserve);
  }

  async index(req, res) {
    const { user_id } = req.headers;
    const reserves = await Reserve.find({ user: user_id })
      .populate("house")
      .populate("user");
    if (!reserves) {
      return res.status(BAD_REQUEST).json({ message: RESERVE_NOT_FOUND });
    }
    return res.json(reserves);
  }

  async show(req, res) {
    const { id } = req.params;
    const { user_id } = req.headers;
    const reserve = await Reserve.findById(id);
    const user = await User.findById(user_id);
    if (!reserve) {
      return res.status(BAD_REQUEST).json({ message: RESERVE_NOT_FOUND });
    }
    if (String(reserve.user) !== String(user._id)) {
      return res.status(FORBIDDEN).json({ message: USER_FORBIDDEN });
    }
    await reserve
      .populate("house")
      .populate("user")
      .execPopulate();
    return res.json(reserve);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { user_id } = req.headers;
    const reserve = await Reserve.findById(id);
    if (!reserve) {
      return res.status(BAD_REQUEST).json({ message: RESERVE_NOT_FOUND });
    }
    if (String(reserve.user) !== String(user_id)) {
      return res.status(FORBIDDEN).json({ message: USER_FORBIDDEN });
    }
    await Reserve.findByIdAndDelete(id);
    return res.json({ message: DELETED_SUCCESS });
  }
}

export default new ReserveController();
