import { connectToDatabase } from 'lib/mongoDB/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();

    const userInfo = await db
      .collection('user')
      .find({}, { projection: { _id: 0, id: 1, imageUrl: 1, name: 1 } })
      .toArray();

    //FIXME: 이 부분에서 디비쿼리로 아래처럼 가져올 수 있는 방법이 있는지 생각해보자

    return res.status(200).json(userInfo);
  } else {
    return res.json({ status: 'only using GET method!' });
  }
}
