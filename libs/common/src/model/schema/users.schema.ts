import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { UserRole } from "@app/common/enums/role.enum";
import { Image } from "./subtype/images.subtype";
import { School } from "./schools.schema";

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  //================================== Attributes =======================================
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: string;

  @Prop({ type: String, default: null })
  email: string;

  @Prop({ type: String, default: null })
  phoneNumber: string;

  @Prop({ type: String, default: null, select: false })
  password: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  //================================== Relations ======================================
  @Prop({ type: [{ type: Types.ObjectId, ref: Image.name, default: null }] })
  images: Image[];

  @Prop({ type: Types.ObjectId, ref: "Schools", default: null })
  school: School;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ geolocation: "2dsphere" });
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });

UserSchema.pre("find", function () {
  this.where({ deletedAt: null });
});
UserSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});
UserSchema.pre("findOneAndUpdate", function () {
  this.where({ deletedAt: null });
});
UserSchema.pre("count", function () {
  this.where({ deletedAt: null });
});
