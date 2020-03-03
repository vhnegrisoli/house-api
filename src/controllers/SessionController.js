import User from '../models/User';

class SessionController {

  async store(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'É necessário informar o email' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    return res.json(user);
  }
}

export default new SessionController();