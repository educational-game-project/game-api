import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";

@Schema({ timestamps: true })
export class Game extends AbstractDocument {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: Number, required: true })
  maxLevel: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);

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