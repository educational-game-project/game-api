import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Images } from './subtype/images.subtype';
import { Users } from './users.schema';

@Schema({ timestamps: true })
export class Schools extends AbstractDocument {
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
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Users', default: null }] })
  admins: Users[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Images.name, default: null }] })
  images: Images[];
}

export const SchoolsSchema = SchemaFactory.createForClass(Schools);

SchoolsSchema.pre('find', function () { this.where({ deletedAt: null }); });
SchoolsSchema.pre('findOne', function () { this.where({ deletedAt: null }); });
SchoolsSchema.pre('findOneAndUpdate', function () { this.where({ deletedAt: null }); });
SchoolsSchema.pre('count', function () { this.where({ deletedAt: null }); });
