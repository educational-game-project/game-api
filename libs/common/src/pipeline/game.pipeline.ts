import { PipelineStage, PopulateOptions } from "mongoose";
import { dateToString } from "./dateToString.pipeline";
import { addedByPipeline } from "./global.pipeline";

export function gamePipeline(query: any, skip?: number, limit?: number): PipelineStage[] {
  let pipeline: any[] = [
    { $match: query },
    skip && { $skip: skip },
    limit && { $limit: limit },
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
      $sort: { createdAt: -1 },
    },
  ];

  return pipeline.filter(Boolean) as PipelineStage[];
}

export const gamePopulate: PopulateOptions[] = [{ path: "game", populate: "images" }]