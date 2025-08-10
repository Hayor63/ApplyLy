import { DocumentType } from "@typegoose/typegoose";
import JobApplicationModel, { JobApplication } from "../models/jobApplication";

export default class JobApplicationRepo {
  static createJobApplication: (
    application: JobApplication
  ) => Promise<DocumentType<JobApplication> | null> = async (
    jobApplication
  ) => {
    return await JobApplicationModel.create(jobApplication);
  };

  // Get details of a specific job application by its ID
  static getById = async (applicationId: string) => {
    const application = await JobApplicationModel.findById(applicationId)
      .populate("jobId", "title description location applicationCount")
      .populate("employerId", "companyName companyWebsite companyDescription")
      .populate({
        path: "applicantId",
        select:
          "userId phoneNumber location resume skills experiences education socialLinks",
        populate: {
          path: "userId",
          select: "fullName email",
        },
      })
      .lean();

    return application;
  };

  //find by id
  static findById = async (id: string) => {
    const application = await JobApplicationModel.findById(id);
    return application;
  };

  // Get all applications for a specific job (and verify the employer owns the job)
  static getAllApplicationForJobByEmployer = async (
    jobId: string
  ): Promise<DocumentType<JobApplication>[]> => {
    return await JobApplicationModel.find({ jobId })
      .populate({
        path: "jobId",
        select: "title ",
      })
      .populate("employerId", "companyName companyWebsite companyDescription")
      .populate({
        path: "applicantId",
        select:
          "userId phoneNumber location resume skills experiences education socialLinks",
        populate: {
          path: "userId",
          select: "fullName email",
        },
      });
  };

  // get all applications by a specific user
  static getAllApplicationByUser: (
    applicantId: string
  ) => Promise<DocumentType<JobApplication>[]> = async (applicantId) => {
    return await JobApplicationModel.find({ applicantId })
      .populate("jobId", "title employerId")
       .populate({
        path: "applicantId",
        select:
          "userId phoneNumber location resume skills experiences education socialLinks",
        populate: {
          path: "userId",
          select: "fullName email",
        },
      })
  };

  // get all applications by employer
  static getAllApplicationsForEmployer: (
    employerId: string
  ) => Promise<DocumentType<JobApplication>[]> = async (employerId) => {
    return await JobApplicationModel.find({ employerId })
      .populate("jobId", "title")
      .populate("employerId", "companyName companyWebsite companyDescription")
      .populate({
        path: "applicantId",
        select:
          "userId phoneNumber location resume skills experiences education socialLinks",
        populate: {
          path: "userId",
          select: "fullName email",
        },
      });
  };

  //update Application
  static updateApplication: (
    id: string,
    updateParams: Partial<JobApplication>
  ) => Promise<DocumentType<JobApplication> | null> = async (
    id,
    updateParams
  ) => {
    const updatedApplication = await JobApplicationModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedApplication;
  };

  //update job status
  static updateJobStatus = async (
    id: string,
    updateParams: Partial<JobApplication>
  ): Promise<DocumentType<JobApplication> | null> => {
    const updatedApplication = await JobApplicationModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedApplication;
  };

  //delete
  static deleteApplication: (
    id: string
  ) => Promise<DocumentType<JobApplication> | null> = async (id) => {
    return await JobApplicationModel.findByIdAndDelete(id);
  };
}
