import multer from "multer";
import path from "path";

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const name = path.basename(file.originalname, extension);
      cb(null, `${name}_${Date.now()}${extension}`);
    }
  })
};
