import { PipelineStage } from "mongoose";
import { TimeHelper } from "../helpers/time.helper";

export function leaderboardPipeline(game: any): PipelineStage[] {
  return [
    {
      $match: {
        game: game,
        createdAt: { $gte: TimeHelper.getToday() },
      }
    },
    {
      $group: {
        _id: "$user",
        value: {
          $sum: "$value",
        },
        user: { $first: "$user" },
      },
    },
    {
      $sort: {
        value: -1
      }
    },
    {
      $limit: 10
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $set: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $group: {
        _id: "$user.school",
        scores: {
          $push: "$$ROOT",
        },
      },
    },
  ];
};