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

var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})
var upload = multer({ storage: storage }).array("file");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case 'POST':
      console.log(req);
      upload(req, res, err => {
        if (err) {
          return res.json({ success: false, err })
        }
        return res.json({ success: true })
      })

      // const authorization = req.headers.authorization;
      // let user;
      // if (authorization?.slice(undefined, 6) === 'Bearer') {
      //   user = await User.findOne({ token: authorization?.slice(7) });
      // }

      // var file = dataUrlToFile(req.body[0].croppedImage, 'test.gif', 'image/gif');
      break;
    default:
      res.status(500).json({ success: false });
      break;
  }
}
