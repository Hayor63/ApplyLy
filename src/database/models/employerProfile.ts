import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { User } from "./userModel";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Employer {
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>;

  @prop({ required: true })
  companyName!: string;

  @prop()
  companyWebsite?: string;

  @prop()
  companyDescription?: string;

  @prop()
  companySize?: string;

  @prop()
  industry?: string;

  @prop()
  companyLocation?: string;
}

const EmployerModel = getModelForClass(Employer);
export default EmployerModel;
