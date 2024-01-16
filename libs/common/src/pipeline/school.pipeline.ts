import { PipelineStage } from "mongoose";
import { dateToString } from "./dateToString.pipeline";
import { addedByPipeline } from "./global.pipeline";

export function schoolPipeline(query: any): PipelineStage[] {
  return [
    {
      $lookup: {
        from: "images",
        localField: "images",
        foreignField: "_id",
        as: "images",
      },
    },
    ...addedByPipeline,
    ...dateToString,
    {
      $match: query,
    },
    {
      $project: { admins: 0 }
    },
    {
      $sort: { createdAt: -1 },
    },
  ]
}