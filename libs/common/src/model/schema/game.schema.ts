import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Image } from "./subtype/images.subtype";
import { User } from "./users.schema";

@Schema({ timestamps: true })
export class Game extends AbstractDocument {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String, default: null })
  description: string;

  @Prop({ type: String, default: null })
  category: string;

  @Prop({ type: Number, required: true })
  maxLevel: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: [{ type: Types.ObjectId, ref: Image.name, default: null }] })
  images: Image[];

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  addedBy: User;
}

export const GameSchema = SchemaFactory.createForClass(Game);

GameSchema.index({ name: 1 });

GameSchema.pre("find", function () {
  this.where({ deletedAt: null });
});
GameSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});
GameSchema.pre("findOneAndUpdate", function () {
  this.where({ deletedAt: null });
});
GameSchema.pre("count", function () {
  this.where({ deletedAt: null });
});