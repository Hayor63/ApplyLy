import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  Ref,
  prop,
  Severity,
} from "@typegoose/typegoose";
import { User } from "./userModel";
import { JobListing } from "./jobListing";
import { Employer } from "./employerProfile";
import { JobSeeker } from "./jobSeekerProfile";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class JobApplication {
  @prop({ ref: () => JobListing, required: true })
  jobId!: Ref<JobListing>;

  @prop({ ref: () => JobSeeker, required: true })
  applicantId!: Ref<JobSeeker>;

  @prop({ ref: () => Employer, required: true })
  employerId!: Ref<Employer>;

  @prop({
    required: true,
    enum: ["pending", "reviewed", "accepted", "rejected"],
  })
  status!: "pending" | "reviewed" | "accepted" | "rejected";

  @prop()
  coverLetter?: string;

  @prop()
  resume?: string;
}
const JobApplicationModel = getModelForClass(JobApplication);
export default JobApplicationModel;
