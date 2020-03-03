import House from '../models/House';

class HouseController {

  async store(req, res) {
    console.log(req.body);
    console.log(req.file);
  }
}

export default new HouseController();