import { dbConnect } from 'lib/mongoDB/dbConnect';
import User from 'lib/mongoDB/models/User';
import Board from 'lib/mongoDB/models/Board';
import Follow from 'lib/mongoDB/models/Follow';
import { connectToDatabase } from 'lib/mongoDB/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();
  console.log('main', req.headers.authorization);
  const authorization = req.headers.authorization;
  let user;
  if (authorization?.slice(undefined, 6) === 'Bearer') {
    user = await User.findOne({ token: authorization?.slice(7) });
  }
  const username = await Follow.aggregate([
    { $match: { follow: user.username } },
    { $project: { _id: 0, username: '$follower' } },
  ]);
  console.log('follow', username);
  // const renameKeys = (
  //   mapping: { [s: string]: unknown } | ArrayLike<unknown>,
  //   objArr: any,
  // ) => {
  //   const renamedObjArr = [];
  //   for (let obj of objArr) {
  //     const renamedObj: { [s: string]: string } = {};
  //     for (let [before, after] of Object.entries(mapping)) {
  //       if (obj[before]) {
  //         renamedObj[after] = obj[before];
  //       }
  //     }
  //     renamedObjArr.push(renamedObj);
  //   }
  //   return renamedObjArr;
  // };
  // const mapping = {
  //   follower: 'username',
  // };
  // const username = renameKeys(mapping, follow);
  // console.log('username', username);
  Board.aggregate(
    [
      {
        $match: {
          $or: username,
        },
      },
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
          _id: 0,
          username: 1,
          boardImageUrl: 1,
          content: 1,
          createdDate: 1,
          modifiedDate: 1,
          location: 1,
          comment: '$comments',
          favoriteCnt: { $size: '$favorites' },
          commentCnt: { $size: '$comments' },
        },
      },
    ],
    (err: any, board: any) => {
      console.log('hello', board);
      if (!board) {
        return res.status(400).json({ status: 400, message: `get failed` });
      }
      return res.status(200).json(board);
    },
  );
}
