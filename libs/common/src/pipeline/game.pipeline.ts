import { PipelineStage } from "mongoose";
import { dateToString } from "./dateToString.pipeline";
import { addedByPipeline } from "./global.pipeline";

export function gamePipeline(query: any): PipelineStage[] {
  return [
    ...addedByPipeline,
    {
      $lookup: {
        from: "images",
        localField: "images",
        foreignField: "_id",
        as: "images",
      },
    },
    ...dateToString,

    {
      $match: query,
    },
    {
      $sort: { createdAt: -1 },
    },
  ]
}