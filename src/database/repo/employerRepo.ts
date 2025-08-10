import { DocumentType } from "@typegoose/typegoose";

import { CreateEmployerInput } from "../../validationSchema/employer";
import JobListingModel, { JobListing } from "../models/jobListing";
import EmployerModel, { Employer } from "../models/employerProfile";

export default class EmployerRepo {
  //create Employer
  static createEmployer: (
    employer: CreateEmployerInput
  ) => Promise<DocumentType<Employer>> = async (employer) => {
    return await EmployerModel.create(employer);
  };

  //find by userID
  static findByUserId = async (
    userId: string
  ): Promise<DocumentType<Employer> | null> => {
    return await EmployerModel.findOne({ userId: userId }).populate(
      "userId",
      "fullName email"
    );
  };

  //get Employer by Id
  static getEmployerById: (
    id: string
  ) => Promise<DocumentType<Employer> | null> = async (id) => {
    return await EmployerModel.findById(id).populate(
      "userId",
      "fullName email"
    );
  };

  //get Employer by User Id
  static getEmployerByUserId = (userId: string) => {
    return EmployerModel.findOne({ userId });
  };

  //delete Job Seeker Profile
  static deleteEmployerProfile = async (userId: string) => {
    return await EmployerModel.findOneAndDelete({ userId });
  };

  //update company profile
  static updateCompanyProfile: (
    id: string,
    updateParams: Partial<Employer>
  ) => Promise<DocumentType<Employer> | null> = async (id, updateParams) => {
    const updatedEmployer = await EmployerModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    return updatedEmployer;
  };
}
