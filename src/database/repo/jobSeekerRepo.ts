import JobSeekerModel, { JobSeeker } from "../models/jobSeekerProfile";
import { JobSeekerTypeInput } from "../../validationSchema/jobSeeker";
import { DocumentType } from "@typegoose/typegoose";


export default class JobSeekerRepo {
  static createJobSeekerProfile: (
    jobSeeker: JobSeekerTypeInput
  ) => Promise<DocumentType<JobSeeker>> = async (jobSeeker) => {
    return await JobSeekerModel.create(jobSeeker);
  };

  //get by Id
  static findById = async (
    id: string
  ): Promise<DocumentType<JobSeeker> | null> => {
    return await JobSeekerModel.findById(id).populate(
      "userId",
      "fullName email"
    );
  };

  //get job seeker by User Id
  static findByUserId = (userId: string) => {
    return JobSeekerModel.findOne({ userId });
  };

  //update Job Seeker Profile
  static updateJobSeekerProfile: (
    id: string,
    updateParams: Partial<JobSeeker>
  ) => Promise<DocumentType<JobSeeker> | null> = async (id, updateParams) => {
    const updatedJobSeeker = await JobSeekerModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedJobSeeker;
  };

  //delete Job Seeker Profile
  static deleteJobSeekerProfile = async (userId: string) => {
    return await JobSeekerModel.findOneAndDelete({ userId });
  };

  //
}
