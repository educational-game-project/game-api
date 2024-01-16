import { PopulateOptions } from "mongoose";

interface IPopulate {
  school?: boolean,
  user?: boolean,
  addedBy?: boolean,
  image?: boolean,
  images?: boolean,
  admins?: boolean,
}

export function globalPopulate(
  select: IPopulate = {
    school: true,
    user: true,
    addedBy: true,
    image: true,
    images: true,
    admins: true,
  }
): PopulateOptions[] {
  return [
    select.school && {
      path: 'school',
      select: "-admins",
      option: { $match: { deletedAt: null } },
      populate: "images"
    },
    select.admins && {
      path: 'admins',
      select: "-password -school -deletedBy -lastUpdatedBy -refreshToken",
      option: { $match: { deletedAt: null } },
      populate: [
        { path: "image" },
        {
          path: "addedBy",
          select: "-password -school -deletedBy -lastUpdatedBy -addedBy -refreshToken",
          populate: "image"
        },
      ]
    },
    select.addedBy && {
      path: "addedBy",
      select: "-password -school -deletedBy -lastUpdatedBy -addedBy -refreshToken",
      option: { $match: { deletedAt: null } },
      populate: "image"
    },
    select.image && {
      path: "image",
    },
    select.images && {
      path: "images",
    },
    select.user && {
      path: "user",
      select: "-password -school -deletedBy -lastUpdatedBy -refreshToken",
      option: { $match: { deletedAt: null } },
      populate: [
        { path: "image" },
        {
          path: "addedBy",
          select: "-password -school -deletedBy -lastUpdatedBy -addedBy -refreshToken",
          populate: "image"
        },
      ]
    }
  ].filter(Boolean);
}