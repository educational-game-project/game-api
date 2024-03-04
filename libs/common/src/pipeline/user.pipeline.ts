import { PipelineStage, PopulateOptions } from "mongoose";
import { dateToString } from "./dateToString.pipeline";
import { addedByPipeline } from "./global.pipeline";

export function userPipeline(query: any, skip?: number, limit?: number): PipelineStage[] {
  let pipeline: any[] = [
    query && {
      $match: query,
    },
    skip && { $skip: skip },
    limit && { $limit: limit },
    {
      $lookup: {
        from: "schools",
        foreignField: "_id",
        localField: "school",
        as: "school",
        pipeline: [
          ...dateToString,
          {
            $lookup: {
              from: "images",
              localField: "images",
              foreignField: "_id",
              as: "images",
            },
          },
          {
            $project: {
              admins: 0,
              addedBy: 0,
              deletedBy: 0,
              lastUpdatedBy: 0,
              deletedAt: 0,
            },
          },
        ],
      },
    },
    ...addedByPipeline,
    {
      $lookup: {
        from: "images",
        localField: "image",
        foreignField: "_id",
        as: "image",
      },
    },
    ...dateToString,
    {
      $set: {
        school: { $ifNull: [{ $arrayElemAt: ["$school", 0] }, null] },
        image: { $ifNull: [{ $arrayElemAt: ["$image", 0] }, null] },
      },
    },
    {
      $project: {
        addedBy: 0,
        deletedBy: 0,
        lastUpdatedBy: 0,
        deletedAt: 0,
        refreshToken: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  return pipeline.filter(Boolean) as PipelineStage[];
}

export const userPopulate: PopulateOptions[] = [
  {
    path: "user",
    populate: [{
      path: "image"
    },
    {
      path: 'school',
      select: "-admins -addedBy",
      populate: 'images'
    }]
  }
]