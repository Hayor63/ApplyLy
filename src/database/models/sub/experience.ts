// models/submodels/Experience.ts
import { prop } from "@typegoose/typegoose";

export class Experience {
  @prop({ required: true })
  jobTitle!: string;

  @prop({ required: true })
  company!: string;

  @prop()
  location?: string;

  @prop({ required: true })
  startDate!: Date;

  @prop()
  endDate?: Date;

  @prop()
  description?: string;
}
