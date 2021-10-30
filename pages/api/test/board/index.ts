import { dbConnect } from 'lib/mongoDB/dbConnect';
import Board from 'lib/mongoDB/models/Board';
import { connectToDatabase } from 'lib/mongoDB/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  Board.aggregate(
    [
      {
        $lookup: {
          from: 'boardFavorites',
          localField: '_id',
          foreignField: 'boardId',
          as: 'favorites',
        },
      },
      {
        $lookup: {
          from: 'boardComments',
          localField: '_id',
          foreignField: 'boardId',
          as: 'comments',
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          boardImageUrl: 1,
          content: 1,
          createdDate: 1,
          modifiedDate: 1,
          location: 1,
          favoriteCnt: { $size: '$favorites' },
          commentCnt: { $size: '$comments' },
        },
      },
    ],
    (err: any, board: any) => {
      if (!board) {
        return res.status(400).json({ status: 400, message: `get failed` });
      }
      return res.status(200).json(board);
    },
  );
}
