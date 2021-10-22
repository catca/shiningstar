import { dbConnect } from 'lib/mongoDB/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';
import Board from 'lib/mongoDB/models/Board';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('connect?');
  await dbConnect();
  console.log('connect!');

  await Board.find({}).then((datas: any) => {
    res.status(200).json(datas);
  });
}
