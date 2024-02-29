import { PipelineStage } from "mongoose";

export function scorePipeline(userId: any): PipelineStage[] {
  return [
    {
      $match: {
        user: userId
      }
    },
    {
      $lookup: {
        from: "games",
        localField: "game",
        foreignField: "_id",
        as: "game",
      },
    },
    {
      $set: {
        game: {
          $ifNull: [
            { $arrayElemAt: ["$game", 0] },
            null,
          ],
        },
      },
    },
    {
      $project: {
        record: 0,
        user: 0,
      },
    },
    {
      $sort: {
        createdAt: 1
      }
    },
    {
      $group: {
        _id: "$game",
        scores: {
          $push: {
            level: "$level",
            value: "$value",
            gamePlayed: "$gamePlayed",
            createdAt: "$createdAt"
          }
        },
      },
    },
  ];
}