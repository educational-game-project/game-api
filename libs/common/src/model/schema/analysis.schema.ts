import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Images } from "./subtype/images.subtype";

@Schema({ timestamps: true })
export class Analysis extends AbstractDocument {
    //================================== Attributes =======================================

    //================================== Relations ======================================
}

export const AnalysisSchema = SchemaFactory.createForClass(Analysis);
