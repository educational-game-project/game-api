import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Users } from './users.schema';
import { GameType } from '@app/common/enums/gameType.enum';

export enum StatusRecord {
  PASSED = "Passed",
  ONGOING = "On Going",
  FAILED = "Failed"
}

@Schema({ timestamps: true })
export class Records extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: String, enum: GameType, default: null })
  game: string;

  @Prop({ type: Number, default: 0 })
  level: number;

  @Prop({ type: [Number], default: null })
  time: number[];

  @Prop({ type: Number, default: 5 })
  liveLeft: number;

  @Prop({ type: Number, default: 0 })
  count: number;

  @Prop({ type: String, enum: StatusRecord, default: StatusRecord.ONGOING })
  status: string;

  @Prop({ type: Boolean, default: true })
  isValid: boolean;

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
