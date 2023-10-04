import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { UserRole } from "@app/common/enums/role.enum";
import { Images } from "./subtype/images.subtype";

@Schema({ timestamps: true })
export class Users extends AbstractDocument {
    //================================== Attributes =======================================
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: string;

    @Prop({ type: [Object], default: null })
    image: Images;

    @Prop({ type: String, default: null })
    email: string;

    @Prop({ type: String, default: null })
    phoneNumber: string;

    @Prop({ type: String, default: null, select: false })
    password: string;

    //================================== Relations ======================================
}

export const UsersSchema = SchemaFactory.createForClass(Users);
