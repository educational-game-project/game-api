import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Images } from './subtype/images.subtype';
import { Users } from './users.schema';
import { GameType } from '@app/common/enums/gameType.enum';

@Schema({ timestamps: true })
export class Records extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: String, enum: GameType, default: null })
  game: string;

  @Prop({ type: Number, default: 0 })
  level: number;

  @Prop({ type: Number, required: true })
  time: number;

  @Prop({ type: Number, required: true })
  liveLeft: number;

  @Prop({ type: Number, required: true })
  count: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: Types.ObjectId, ref: Users.name, default: null })
  user: Users;
}

export const RecordsSchema = SchemaFactory.createForClass(Records);

RecordsSchema.pre('find', function () { this.where({ deletedAt: null }); });
RecordsSchema.pre('findOne', function () { this.where({ deletedAt: null }); });
RecordsSchema.pre('findOneAndUpdate', function () { this.where({ deletedAt: null }); });
RecordsSchema.pre('count', function () { this.where({ deletedAt: null }); });
