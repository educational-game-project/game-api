import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "../abstract.schema";

@Schema({ timestamps: true })
export class Images extends AbstractDocument {
    @Prop({ type: String, default: null })
    originalname: string;

    @Prop({ type: String, default: null })
    originalImage: string;

    @Prop({ type: String, default: null })
    mimeType: string;

    @Prop({ type: Boolean, default: false })
    isDefault?: boolean;
}

export const ImagesSchema = SchemaFactory.createForClass(Images);