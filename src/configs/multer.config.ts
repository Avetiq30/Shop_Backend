import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      // const randomName = Array(10)
      //   .fill(null)
      //   .map(() => Math.round(Math.random() * 16).toString(16))
      //   .join('');
      cb(null, `${uuidv4()}${extname(file.originalname)}`);
    },
  }),
};
