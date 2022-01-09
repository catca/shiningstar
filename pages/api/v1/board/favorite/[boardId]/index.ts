import nextConnect from 'next-connect';

import { dbConnect } from 'lib/mongoDB/dbConnect';
import Board from 'lib/mongoDB/models/Board';
import BoardFavorite from 'lib/mongoDB/models/BoardFavorite';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkUser } from 'lib/middlewares';

const apiRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req: any, res: NextApiResponse) => {
  await dbConnect();
  const { boardId } = req.query;

  BoardFavorite.aggregate(
    [
      { $match: { boardId } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'username',
          foreignField: 'username',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          username: 1,
          boardId: 1,
          createDate: 1,
          imageUrl: '$user.imageUrl',
          name: '$user.name',
        },
      },
    ],
    (err: any, boardFavs: any) => {
      return res.status(200).json(boardFavs);
    },
  );
});

apiRoute.use(checkUser());

apiRoute.post(async (req: any, res: NextApiResponse) => {
  await dbConnect();

  const { boardId } = req.query;

  if (!req.user) {
    return res.status(405).json({ status: 405, message: 'user doesnt exist' });
  }

  const board = await Board.find({ _id: boardId });

  if (board) {
    BoardFavorite.find(
      { boardId, username: req.user.username },
      (err: any, boardFav: any) => {
        if (!err) {
          if (boardFav.length === 0) {
            let fav = new BoardFavorite({
              boardId: boardId,
              username: req.user.username,
              createDate: new Date(),
            });
            fav.save((err: any) => {
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
          } else {
            return res
              .status(500)
              .json({ status: 400, message: 'push favorite failed' });
          }
        }
      },
    );
  } else {
    return res
      .status(500)
      .json({ status: 400, message: 'boardId doesnt exist' });
  }
});

apiRoute.delete(async (req: any, res: NextApiResponse) => {
  await dbConnect();

  const { boardId } = req.query;

  if (!req.user) {
    return res.status(405).json({ status: 405, message: 'user doesnt exist' });
  }
  BoardFavorite.findOneAndRemove(
    { boardId, username: req.user.username },
    (err: any, boardFav: any) => {
      if (!boardFav) {
        return res.status(500).json({ status: 400, message: 'delete failed' });
      } else {
        return res.status(200).json({ status: 200, message: 'delete success' });
      }
    },
  );
});

export default apiRoute;
