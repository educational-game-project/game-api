import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { User } from "./users.schema";
import { GameType } from "@app/common/enums/gameType.enum";
import { Record } from "./records.schema";

@Schema({ timestamps: true })
export class Score extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: String, enum: GameType, default: null })
  game: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Record.name, default: null }] })
  records: Record[];

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Number, default: 0 })
  rank: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: User;
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
