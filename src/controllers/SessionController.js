import User from '../models/User';
import { NOT_FOUND, EMAIL_REQUIRED } from '../utils/ValidationMessages';

class SessionController {
  async store(req, res) {
    const { email } = req.body;
    if (!email) {
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
