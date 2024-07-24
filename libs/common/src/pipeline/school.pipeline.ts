import { PipelineStage } from "mongoose";
import { dateToString } from "./dateToString.pipeline";
import { addedByPipeline } from "./global.pipeline";

export function schoolPipeline(query: any, skip?: number, limit?: number): PipelineStage[] {
  let pipeline: any[] = [
    {
      $match: query,
    },
    skip && { $skip: skip },
    limit && { $limit: limit },
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
      $project: {
        admins: 0,
        lastUpdatedBy: 0,
        deleteBy: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  return pipeline.filter(Boolean) as PipelineStage[];
}