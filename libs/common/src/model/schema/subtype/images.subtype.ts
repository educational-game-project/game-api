import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../abstract.schema';

@Schema({ timestamps: true })
export class Image extends AbstractDocument {
  @Prop({ type: String, default: null })
  originalName: string;

  @Prop({ type: String, default: null })
  fileName: string;

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

export const ImageSchema = SchemaFactory.createForClass(Image);

ImageSchema.pre('find', function () { this.where({ deletedAt: null }); });
ImageSchema.pre('findOne', function () { this.where({ deletedAt: null }); });
ImageSchema.pre('findOneAndUpdate', function () { this.where({ deletedAt: null }); });
ImageSchema.pre('count', function () { this.where({ deletedAt: null }); });
