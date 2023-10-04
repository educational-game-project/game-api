import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Images } from "./subtype/images.subtype";

@Schema({ timestamps: true })
export class Records extends AbstractDocument {
    //================================== Attributes =======================================


    //================================== Relations ======================================
}

export const RecordsSchema = SchemaFactory.createForClass(Records);
