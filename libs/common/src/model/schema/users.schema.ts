import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { UserRole } from '@app/common/enums/role.enum';
import { Images } from './subtype/images.subtype';
import { Schools } from './schools.schema';

@Schema({ timestamps: true })
export class Users extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Images.name, default: null }] })
  images: Images[];

  @Prop({ type: String, default: null })
  email: string;

  @Prop({ type: String, default: null })
  phoneNumber: string;

  @Prop({ type: String, default: null, select: false })
  password: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: Types.ObjectId, ref: 'Schools', default: null })
  school: Schools;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

UsersSchema.index({ geolocation: '2dsphere' });
UsersSchema.index({ email: 1 });
UsersSchema.index({ phoneNumber: 1 });

UsersSchema.pre('find', function () { this.where({ deletedAt: null }); });
UsersSchema.pre('findOne', function () { this.where({ deletedAt: null }); });
UsersSchema.pre('findOneAndUpdate', function () { this.where({ deletedAt: null }); });
UsersSchema.pre('count', function () { this.where({ deletedAt: null }); });
