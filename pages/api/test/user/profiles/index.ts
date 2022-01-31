import Profile from 'lib/mongoDB/models/Profile';
import { dbConnect } from 'lib/mongoDB/dbConnect';
import { connectToDatabase } from 'lib/mongoDB/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const profile = await Profile.find(
        {},
        { _id: 0, username: 1, name: 1, imageUrl: 1 },
      );
      return res.status(200).json(profile);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(405).json({
      status: 405,
      message: `possible only GET/PATCH method, input 'method' : ${req.method}`,
    });
  }
}
