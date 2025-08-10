// models/submodels/Education.ts
import { prop } from "@typegoose/typegoose";

export class Education {
  @prop({ required: true })
  institution!: string;

  @prop({ required: true })
  degree!: string;

  @prop({ required: true })
  fieldOfStudy!: string;

  @prop()
  startDate?: Date;

  @prop()
  endDate?: Date;

  @prop()
  grade?: string;
}
