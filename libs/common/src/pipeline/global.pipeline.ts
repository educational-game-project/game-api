import { PipelineStage } from "mongoose";

export const addedByPipeline: PipelineStage[] = [{
  $lookup: {
    from: "users",
    localField: "addedBy",
    foreignField: "_id",
    as: "addedBy",
    pipeline: [
      {
        $match: { deletedAt: null }
      },
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
          addedBy: 0,
          deletedBy: 0,
          lastUpdatedBy: 0,
          deletedAt: 0,
        },
      },
    ]
  }
},
{
  $set: {
    addedBy: { $ifNull: [{ $arrayElemAt: ["$addedBy", 0] }, null] },
  },
},
]