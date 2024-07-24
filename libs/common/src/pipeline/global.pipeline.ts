import { PipelineStage } from "mongoose";

export const addedByPipeline: PipelineStage[] = [
  {
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
          }
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
            role: 1,
            phoneNumber: 1,
            isActive: 1,
            image: 1,
            school: 1,
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
];