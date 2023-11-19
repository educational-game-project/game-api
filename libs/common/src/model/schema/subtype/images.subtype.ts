import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../abstract.schema';

@Schema({ timestamps: true })
export class Images extends AbstractDocument {
  @Prop({ type: String, default: null })
  originalname: string;

  @Prop({ type: String, default: null })
  filename: string;

  @Prop({ type: String, required: true })
  fileLink: string;

  @Prop({ type: String, default: null })
  mimeType: string;

  @Prop({ type: Number, default: null })
  size: number;

  @Prop({ type: Boolean, default: false })
  isDefault?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const ImagesSchema = SchemaFactory.createForClass(Images);

ImagesSchema.pre('find', function () { this.where({ deletedAt: null }); });
ImagesSchema.pre('findOne', function () { this.where({ deletedAt: null }); });
ImagesSchema.pre('findOneAndUpdate', function () { this.where({ deletedAt: null }); });
ImagesSchema.pre('count', function () { this.where({ deletedAt: null }); });
