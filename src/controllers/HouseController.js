import House from '../models/House';
import User from '../models/User';
import * as Yup from 'yup';
import {
  BAD_REQUEST,
  NOT_ENOUGH_FIELDS,
  DELETED_SUCCESS,
  HOUSE_NOT_FOUND,
  FORBIDDEN,
  USER_FORBIDDEN
} from '../utils/ValidationMessages';

class HouseController {
  async store(req, res) {

    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.boolean().required(),
    });

    const { filename } = req.file;
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers;

    if (!await schema.isValid(req.body)) {
      return res.status(BAD_REQUEST).json({ message: NOT_ENOUGH_FIELDS })
    }

    const house = await House.create({
      thumbnail: filename,
      user: user_id,
      description,
      price,
      location,
      status,
    });
    return res.json(house);
  }

  async index(req, res) {
    const { status } = req.query;
    const { user_id } = req.headers;

    const houses = await House.find({ status: status, user: user_id });
    return res.json({ houses });
  }

  async update(req, res) {

    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.boolean().required(),
    });

    const { filename } = req.file;
    const { id } = req.params;
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers;

    if (!await schema.isValid(req.body)) {
      return res.status(BAD_REQUEST).json({ message: NOT_ENOUGH_FIELDS });
    }

    const house = await House.updateOne(
      { _id: id },
      {
        thumbnail: filename,
        user: user_id,
        description,
        price,
        location,
        status,
      });
    return res.json(house);
  }

  async show(req, res) {
    const { id } = req.params;
    const { user_id } = req.headers;
    const house = await House.findById(id);
    const user = await User.findById(user_id);
    if (!house) {
      return res.status(BAD_REQUEST).json({ message: HOUSE_NOT_FOUND });
    }
    if (String(user._id) !== String(house.user)) {
      return res.status(FORBIDDEN).json({ message: USER_FORBIDDEN });
    }
    return res.json(house);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { user_id } = req.headers;
    const house = await House.findById(id);
    const user = await User.findById(user_id);
    if (!house) {
      return res.status(BAD_REQUEST).json({ message: HOUSE_NOT_FOUND });
    }
    if (String(user._id) !== String(house.user)) {
      return res.status(FORBIDDEN).json({ message: USER_FORBIDDEN });
    }
    await House.findByIdAndDelete(id);
    return res.json({ message: DELETED_SUCCESS });
  }
}

export default new HouseController();
