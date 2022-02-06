import { checkUser } from 'lib/middlewares';
import { dbConnect } from 'lib/mongoDB/dbConnect';
import Follow from 'lib/mongoDB/models/Follow';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const apiRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(checkUser());

apiRoute.get(async (req: any, res: NextApiResponse) => {
  await dbConnect();

  const { username } = req.query;

  Follow.aggregate(
    [
      { $match: { follow: username } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'follower',
          foreignField: 'username',
          as: 'profile',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: 'follow',
          foreignField: 'follower',
          as: 'followerList',
        },
      },
      { $unwind: '$profile' },
      {
        $project: {
          _id: 1,
          followers: '$followerList',
          username: '$follower',
          name: '$profile.name',
          imageUrl: '$profile.imageUrl',
          // relation: {
          //   $cond: [
          //     {
          //       $eq: ['followers.$follow', '$username'],
          //     },
          //     true,
          //     false,
          //   ],
          // },
        },
      },
    ],
    (err: any, follow: any) => {
      if (!follow) {
        return res.status(400).json({ status: 400, message: 'get faileds' });
      } else {
        return res.status(200).json(follow);
      }
    },
  );
});

apiRoute.post(async (req: any, res: NextApiResponse) => {
  await dbConnect();

  const { username } = req.query;

  Follow.findOne(
    { follow: username, follower: req.user.username },
    (err: any, follow: any) => {
      if (follow) {
        return res.status(400).json({
          status: 400,
          message: `You are already following! follow:${username}, follower:${req.user.username}`,
        });
      } else {
        var follow = new Follow({
          follow: username,
          follower: req.user.username,
        });
        follow.createDate = new Date();
        follow.save((err: any) => {
          if (err) {
            return res
              .status(500)
              .json({ status: 400, message: 'save failed' });
          } else {
            return res
              .status(200)
              .json({ status: 200, message: 'save success' });
          }
        });
      }
    },
  );
});

apiRoute.delete(async (req: any, res: NextApiResponse) => {
  await dbConnect();

  const { username } = req.query;

  Follow.findOneAndDelete(
    { follow: username, follower: req.user.username },
    (err: any, follow: any) => {
      if (!follow) {
        return res
          .status(400)
          .json({ status: 400, message: `You are not already following!` });
      }
      if (err) {
        return res.status(500).json({ status: 400, message: 'delete failed' });
      } else {
        return res.status(200).json({ status: 200, message: 'delete success' });
      }
    },
  );
});

export default apiRoute;
