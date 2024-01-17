import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { User } from "./users.schema";
import { Game } from "./game.schema";

@Schema({ timestamps: true })
export class Level extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: Number, default: 1 })
  current: number;

  @Prop({ type: Number, default: 1 })
  max: number;

  @Prop({ type: Boolean, default: true })
  isValid: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: User;

  @Prop({ type: Types.ObjectId, ref: Game.name, default: null })
  game: Game;
}

export const LevelSchema = SchemaFactory.createForClass(Level);

LevelSchema.pre("find", function () {
  this.where({ deletedAt: null });
});
LevelSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});
LevelSchema.pre("findOneAndUpdate", function () {
  this.where({ deletedAt: null });
});
LevelSchema.pre("count", function () {
  this.where({ deletedAt: null });
});
