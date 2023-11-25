import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { User } from './users.schema';

@Schema({ timestamps: true })
export class Analysis extends AbstractDocument {
  //================================== Attributes =======================================

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: User;
}

export const AnalysisSchema = SchemaFactory.createForClass(Analysis);

AnalysisSchema.pre('find', function () { this.where({ deletedAt: null }); });
AnalysisSchema.pre('findOne', function () { this.where({ deletedAt: null }); });
AnalysisSchema.pre('findOneAndUpdate', function () { this.where({ deletedAt: null }); });
AnalysisSchema.pre('count', function () { this.where({ deletedAt: null }); });
