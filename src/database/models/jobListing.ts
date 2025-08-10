import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  Ref,
  prop,
  Severity,
} from "@typegoose/typegoose";
import { Employer } from "./employerProfile";


@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})

export class JobListing {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  description!: string;

  @prop({ ref: () => Employer, required: true })
  employerId!: Ref<Employer>;

  @prop({ required: true })
  location!: string;

  @prop({ required: true })
  salary!: number;

  @prop({ default: false })
  isFilled?: boolean;

  @prop({ default: 0 })
  applicationCount?: number;

  @prop({ required: true, enum: ["open", "closed"] })
  status!: "open" | "closed";

  @prop({ required: true, enum: ["remote", "on-site", "hybrid"] })
  workMode!: "remote" | "on-site" | "hybrid";

  @prop({ required: true, enum: ["junior", "mid", "senior"] })
  experienceLevel!: "junior" | "mid" | "senior"

  @prop({ required: true, enum: ["full-time", "part-time", "contract", "internship"] })
  jobType!: "full-time" | "part-time" | "contract" | "internship";

  @prop({ required: true, type: () => [String] })
  skills!: string[];
}

const JobListingModel = getModelForClass(JobListing);
export default JobListingModel;
