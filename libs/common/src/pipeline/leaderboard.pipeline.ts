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
        _id: { user: "$user", level: "$level" },
        value: {
          $avg: "$value",
        },
        level: { $first: "$level" },
        user: { $first: "$user" },
      },
    },
    {
      $group: {
        _id: "$user",
        value: {
          $avg: "$value",
        },
        user: { $first: "$user" },
      },
    },
    {
      $sort: {
        value: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $lookup: {
              from: "images",
              localField: "image",
              foreignField: "_id",
              as: "image",
            },
          },
          {
            $set: {
              image: { $ifNull: [{ $arrayElemAt: ["$image", 0] }, null] },
            }
          },
          {
            $project: {
              name: 1,
              role: 1,
              email: 1,
              phoneNumber: 1,
              image: 1,
              school: 1,
              deletedAt: 1,
              createdAt: 1,
              updatedAt: 1,
            }
          }
        ]
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