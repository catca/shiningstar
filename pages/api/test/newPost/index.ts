import { dbConnect } from 'lib/mongoDB/dbConnect';
import nextConnect from 'next-connect';

import User from 'lib/mongoDB/models/User';
import Board from 'lib/mongoDB/models/Board';
import Follow from 'lib/mongoDB/models/Follow';
import { connectToDatabase } from 'lib/mongoDB/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import multer from 'multer';
import path from 'path';
import axios from 'axios';

const dataUrlToFile = async (
  dataUrl: string,
  fileName: string,
  mimeType: string,
): Promise<File> => {
  const res = await axios(dataUrl);
  const blob: Blob = res.data;
  return new File([blob], fileName, { type: mimeType });
};

var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
var upload = multer({ storage: storage });

const uploadMiddleware = upload.array('file');

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch: (req, res) => {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(uploadMiddleware);

apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { method } = req;
//   await dbConnect();
//   switch (method) {
//     case 'POST':
//       // console.log('req');
//       console.log('req.body', req.body);
//       upload.array('file');
//       // upload(req, res, (err) => {
//       //   if (err) {
//       //     console.log('error');
//       //     return res.json({ success: false, err });
//       //   }
//       //   console.log('성공');
//       //   return res.json({ success: true });
//       // });

//       // const authorization = req.headers.authorization;
//       // let user;
//       // if (authorization?.slice(undefined, 6) === 'Bearer') {
//       //   user = await User.findOne({ token: authorization?.slice(7) });
//       // }

//       // var file = dataUrlToFile(req.body[0].croppedImage, 'test.gif', 'image/gif');
//       break;
//     default:
//       res.status(500).json({ success: false });
//       break;
//   }
// }
