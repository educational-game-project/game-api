import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { User } from "./users.schema";

@Schema({ timestamps: true })
export class Log extends AbstractDocument {
  @Prop({ type: Types.ObjectId, ref: "User" })
  actor: User;

  @Prop()
  target: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  type: string;

  @Prop()
  method: string;

  @Prop()
  userAgent: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: String, default: null })
  summary: string;
}

export const LogSchema = SchemaFactory.createForClass(Log)