import { dbConnect } from 'lib/mongoDB/dbConnect';
import User from 'lib/mongoDB/models/User';
import Board from 'lib/mongoDB/models/Board';
import Follow from 'lib/mongoDB/models/Follow';
import { connectToDatabase } from 'lib/mongoDB/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import multer from 'multer';
import path from 'path';
import axios from 'axios';

const dataUrlToFile = async (dataUrl: string, fileName: string, mimeType: string): Promise<File> => {
  const res = await axios(dataUrl);
  const blob: Blob = res.data;
  return new File([blob], fileName, { type: mimeType });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case 'POST':
      const authorization = req.headers.authorization;
      let user;
      if (authorization?.slice(undefined, 6) === 'Bearer') {
        user = await User.findOne({ token: authorization?.slice(7) });
      }

      var file = dataUrlToFile(req.body[0].croppedImage, 'test.gif', 'image/gif');
      // var storage = multer.diskStorage({
      //   destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
      //     cb(null, "./public/uploads");
      //   },
      //   filename: function (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) {
      //     const nowDate = Date.now();
      //     cb(null, `${nowDate}_${file.originalname}`);
      //   },
      //   fileFilter: function (req: any, file: { originalname: any; }, callback: (arg0: Error | null, arg1: boolean | undefined) => void) {
      //     var ext = path.extname(file.originalname);
      //     if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      //       return callback(null, false);
      //     }
      //     callback(null, true);
      //   },
      //   limits: {
      //     fileSize: 1024 * 1024,
      //   },
      // });
      // var upload = multer({ storage: storage });
      res.status(200).json({ file: file })
      break;
    default:
      res.status(500).json({ success: false });
      break;
  }
}
