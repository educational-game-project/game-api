import { PipelineStage } from "mongoose";

export function logsPipeline(query: any, skip?: number, limit?: number): PipelineStage[] {
  let pipeline: any[] = [
    {
      $lookup: {
        from: "users",
        localField: "actor",
        foreignField: "_id",
        as: "actor",
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
            $lookup: {
              from: "schools",
              localField: "school",
              foreignField: "_id",
              as: "school",
              pipeline: [
                { $match: { deletedAt: null } },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    address: 1,
                  }
                }
              ]
            },
          },
          {
            $set: {
              image: { $ifNull: [{ $arrayElemAt: ["$image", 0] }, null] },
              school: { $ifNull: [{ $arrayElemAt: ["$school", 0] }, null] },
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              phoneNumber: 1,
              isActive: 1,
              image: 1,
              school: 1,
            }
          }
        ]
      }
    },
    {
      $set: {
        actor: { $ifNull: [{ $arrayElemAt: ["$actor", 0] }, null] },
      }
    },
    { $match: query },
    skip && { $skip: skip },
    limit && { $limit: limit },
  ]

  return pipeline.filter(Boolean) as PipelineStage[];
}