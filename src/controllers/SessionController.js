import User from '../models/User';
import { NOT_FOUND, EMAIL_REQUIRED } from '../utils/ValidationMessages';
import * as Yup from 'yup';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required()
    })
    const { email } = req.body;
    if (!await schema.isValid(req.body)) {
      return res.status(NOT_FOUND).json({ message: EMAIL_REQUIRED });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }
    return res.json(user);
  }
}

export default new SessionController();
