import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { Experience } from "./sub/experience";
import { Education } from "./sub/education";
import { SocialLinks } from "./sub/socialLinks";
import { User } from "./userModel";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class JobSeeker {
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>;

  @prop()
  phoneNumber?: string;

  @prop({ default: "Bio not added yet" })
  bio?: string;

  @prop()
  location?: string;

  @prop()
  resume?: string;

  @prop({ type: () => [String] })
  skills?: string[];

  @prop({ type: () => [Experience], _id: false })
  experiences?: Experience[];

  @prop({ type: () => [Education], _id: false })
  education?: Education[];

  @prop({ _id: false })
  socialLinks?: SocialLinks;
}
const JobSeekerModel = getModelForClass(JobSeeker);
export default JobSeekerModel;
