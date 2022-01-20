import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from 'lib/mongoDB/dbConnect';
import Profile from 'lib/mongoDB/models/Profile';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    await dbConnect();
    const { user }: any = req.query;
    const data = await Profile.find(
        { $or: [{ username: new RegExp(user) }, { name: new RegExp(user) }] },
        { _id: 0, imageUrl: 1, username: 1, name: 1 }
    );

    res.status(200).json(data);
}