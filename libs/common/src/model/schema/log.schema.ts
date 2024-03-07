import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { User } from "./users.schema";

export interface ILogsData {
  target: string,
  description: string,
  summary?: string,
  type?: string,
  success?: boolean,
  actor?: string
}

@Schema({ timestamps: true })
export class Log extends AbstractDocument {
  @Prop({ type: Types.ObjectId, ref: "User", default: null })
  actor: User;

  @Prop({ type: String, default: null })
  target: string;

  @Prop({ type: String, default: null })
  type: string;

  @Prop({ type: String, default: null })
  method: string;

  @Prop({ type: String, default: null })
  userAgent: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: String, default: null })
  summary: string;

  @Prop({ type: Boolean, default: true })
  success: boolean;
}

export const LogSchema = SchemaFactory.createForClass(Log)