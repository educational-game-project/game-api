import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Image } from "./subtype/images.subtype";
import { User } from "./users.schema";

@Schema({ timestamps: true })
export class School extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: null })
  address: string;

  @Prop({ type: Number, default: 0 })
  adminsCount: number;

  @Prop({ type: Number, default: 0 })
  studentsCount: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: [{ type: Types.ObjectId, ref: "User", default: null }] })
  admins: User[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Image.name, default: null }] })
  images: Image[];
}

export const SchoolSchema = SchemaFactory.createForClass(School);

SchoolSchema.pre("find", function () {
  this.where({ deletedAt: null });
});
SchoolSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});
SchoolSchema.pre("findOneAndUpdate", function () {
  this.where({ deletedAt: null });
});
SchoolSchema.pre("count", function () {
  this.where({ deletedAt: null });
});
