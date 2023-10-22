import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Users } from './users.schema';
import { GameType } from '../../enums/gameType.enum';

@Schema({ timestamps: true })
export class Levels extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: Number, default: 0 })
  current: number;

  @Prop({ type: String, enum: GameType, default: null })
  game: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: Types.ObjectId, ref: Users.name, default: null })
  user: Users;
}

export const LevelsSchema = SchemaFactory.createForClass(Levels);

LevelsSchema.pre('find', function () {
  this.where({ deletedAt: null });
});
LevelsSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});
LevelsSchema.pre('findOneAndUpdate', function () {
  this.where({ deletedAt: null });
});
LevelsSchema.pre('count', function () {
  this.where({ deletedAt: null });
});
