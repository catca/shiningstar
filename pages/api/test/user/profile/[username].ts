import { connectToDatabase } from 'lib/mongoDB/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { db } = await connectToDatabase();

  const { username } = req.query;

  if (req.method === 'GET') {
    const profiles = await db
      .collection('profiles')
      .findOne({ username: username });

    if (!profiles) {
      return res.status(400).json({
        status: '400',
        message: `maybe this username(path) doesn't exist! /  input 'username' : ${username}`,
      });
    }

    const boardCnts = await db
      .collection('boards')
      .find({ username: username })
      .count();

    const followerCnts = await db
      .collection('follows')
      .find({ follow: username })
      .count();

    const followingCnts = await db
      .collection('follows')
      .find({ follower: username })
      .count();

    return res.status(200).json({
      ...profiles,
      followerCnt: followerCnts,
      followingCnt: followingCnts,
      boardCnt: boardCnts,
    });
  } else if (req.method === 'PATCH') {
    //TODO: 자기정보 수정 api 짜기
    const userInfo = req.body;

    const success = await db
      .collection('profiles')
      .updateOne({ username: username }, { $set: userInfo })
      .then((res: any) => {
        return res.matchedCount === 1 ? true : false;
      });

    if (success) {
      return res.status(201).json({ status: 201, result: success });
    } else {
      return res.status(400).json({ status: 400, result: success });
    }
  } else {
    return res.status(405).json({
      status: 405,
      message: `possible only GET/PATCH method, input 'method' : ${req.method}`,
    });
  }
  // else if (req.method === 'POST') {

  //   const followerInfo = req.body;

  //   if (username === followerInfo.id) {
  //     return res.json({
  //       status: 0,
  //       message: `failed (can't follow me)`,
  //     });
  //   }

  //   const followCheck = await db.collection('user').findOne({
  //     id: username,
  //     follower: { $elemMatch: { id: followerInfo.id } },
  //   });
  //   const followedUser = await db
  //     .collection('user')
  //     .findOne(
  //       { id: username },
  //       { projection: { _id: 0, id: 1, name: 1, imageUrl: 1 } },
  //     );

  //   if (followCheck === null) {
  //     await db
  //       .collection('user')
  //       .updateOne({ id: username }, { $push: { follower: followerInfo } });

  //     await db
  //       .collection('user')
  //       .updateOne(
  //         { id: followerInfo.id },
  //         { $push: { following: followedUser } },
  //       );

  //     return res
  //       .status(200)
  //       .json({ status: 200, message: 'following success!' });
  //   } else {
  //     await db
  //       .collection('user')
  //       .updateOne(
  //         { id: username },
  //         { $pull: { follower: { id: followerInfo.id } } },
  //       );

  //     await db
  //       .collection('user')
  //       .updateOne(
  //         { id: followerInfo.id },
  //         { $pull: { following: { id: username } } },
  //       );

  //     return res
  //       .status(200)
  //       .json({ status: 200, message: 'following cancel success!' });
  //   }
  // } else if (req.method === 'PATCH') {
  //   await db.collection('user').updateOne({ id: username }, { $set: req.body });

  //   return res.json({ status: 0, message: 'succeced' });
  // } else {
}
