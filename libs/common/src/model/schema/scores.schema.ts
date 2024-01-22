import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { User } from "./users.schema";
import { Record } from "./records.schema";
import { Game } from "./game.schema";

@Schema({ timestamps: true })
export class Score extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: User;

  @Prop({ type: Types.ObjectId, ref: Game.name, default: null })
  game: Game;

  @Prop({ type: Types.ObjectId, ref: Record.name, default: null })
  records: Record[];
}

export const ScoreSchema = SchemaFactory.createForClass(Score);

ScoreSchema.pre("find", function () {
  this.where({ deletedAt: null });
});
ScoreSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});
ScoreSchema.pre("findOneAndUpdate", function () {
  this.where({ deletedAt: null });
});
ScoreSchema.pre("count", function () {
  this.where({ deletedAt: null });
});
