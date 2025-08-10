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
import { JobListing } from "./jobListing";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Bookmark {
  @prop({ ref: () => User, required: true })
  userId!: Ref<User>;

  @prop({ ref: () => JobListing, required: true })
  jobListingId!: Ref<JobListing>;
}

const BookmarkModel = getModelForClass(Bookmark);
export default BookmarkModel;
