import { Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class AbstractDocument {
  _id?: Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}
