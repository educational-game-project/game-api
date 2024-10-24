import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "./abstract.schema";

@Schema({ timestamps: true })
export class PortfolioVisitor extends AbstractDocument {
  @Prop({ type: Number, default: 1 })
  number: number;

  @Prop({ type: String, default: null })
  ipAddress: string;

  @Prop({ type: String, default: null })
  city: string;

  @Prop({ type: String, default: null })
  region: string;

  @Prop({ type: String, default: null })
  country: string;

  @Prop({ type: String, default: null })
  continent: string;

  @Prop({ type: String, default: null })
  loc: string;

  @Prop({ type: String, default: null })
  timezone: string;

  @Prop({ type: String, default: null })
  time: string;

  @Prop({ type: String, default: null })
  timeName: string;

  @Prop({ type: String, default: null })
  date: string;

  @Prop({ type: String, default: null })
  user_agent: string;

  @Prop({ type: String, default: null })
  device: string;
}

export const PortfolioVisitorSchema = SchemaFactory.createForClass(PortfolioVisitor)