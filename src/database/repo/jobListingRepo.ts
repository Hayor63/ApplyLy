import { z } from "zod";
import { formatResponseRecord } from "../../utils/formatter";
import { PartialLoose } from "../../utils/helper";
import {
  jobFiltersSchema,
  jobFiltersSchemaInput,
  JobListingTypeInput,
} from "../../validationSchema/jobListing";
import JobListingModel, { JobListing } from "../models/jobListing";
import { DocumentType } from "@typegoose/typegoose";

interface JobListingFilters {
  location?: string;
  workMode?: "remote" | "on-site" | "hybrid";
  experienceLevel?: "junior" | "mid" | "senior";
  jobType?: "full-time" | "part-time" | "contract" | "internship";
  skills?: string[];
  isFilled?: boolean;
  status?: "open" | "closed";
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  limit?: number;
}

class JobListingExtend extends JobListing {
  createdAt: string;
}

type SortLogic = PartialLoose<JobListingExtend, "asc" | "desc" | 1 | -1>;
const defaultSortLogic: SortLogic = { createdAt: -1 };
export interface PaginatedFetchParams {
  pageNumber: number;
  pageSize: number;
  filter: Record<string, any>;
  sortLogic: SortLogic;
  search: string;
}

export default class jobListingRepo {
  static createJobListing: (
    jobListing: JobListingTypeInput
  ) => Promise<DocumentType<JobListing>> = async (jobListing) => {
    return await JobListingModel.create(jobListing);
  };

  //get single job listing by ID
  static getJobListingById = async (
    id: string
  ): Promise<DocumentType<JobListing> | null> => {
    return await JobListingModel.findById(id).populate(
      "employerId",
      "companyName companyWebsite companyDescription"
    );
  };

  //findbyId
  static findById = async (id: string) => {
    return await JobListingModel.findById(id);
  };

  //get all job listings
  static getPaginatedJobListing = async ({
    pageNumber = 1,
    pageSize = 10,
    filter: _filter,
    sortLogic = defaultSortLogic,
    search,
  }: Partial<PaginatedFetchParams>) => {
    const filter = {
      ...(_filter || {}),
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const [totalItems, jobLists] = await Promise.all([
      JobListingModel.countDocuments(filter),
      JobListingModel.find(filter)
        .sort(sortLogic)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(),
    ]);

    const formattedListings: JobListing[] = jobLists.map((listing) =>
      formatResponseRecord(listing)
    );

    return {
      data: formattedListings,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  };

  //update job listing
  static updateJobListing: (
    id: string,
    updateParams: Partial<JobListing>
  ) => Promise<DocumentType<JobListing> | null> = async (id, updateParams) => {
    const updatedJobListing = await JobListingModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "employerId",
      "companyName companyWebsite companyDescription industry companyLocation"
    );
    return updatedJobListing;
  };

  // Update job listing status with ownership check
  static updateJobListingStatus = async (
    id: string,
    updateParams: Partial<JobListing>
  ): Promise<DocumentType<JobListing> | null> => {
    return JobListingModel.findByIdAndUpdate(
      id,
      updateParams,
      {
        new: true,
        runValidators: true,
      }
    );
  };

  //delete job listing
  static deleteJobListing = async (id: string) => {
    return await JobListingModel.findByIdAndDelete(id);
  };

  //get all jobs by employer ID
  static getJobsByEmployerId = async (
    employerId: string
  ): Promise<DocumentType<JobListing>[]> => {
    return await JobListingModel.find({ employerId }).populate(
      "employerId",
      "companyName companyWebsite companyDescription industry companyLocation"
    );
  };

  //job recommendations based on skills
  static getJobRecommendations = async (
    skills: string[],
    page = 1,
    limit = 10
  ): Promise<{ jobs: DocumentType<JobListing>[]; total: number }> => {
    const query = {
      skills: { $in: skills },
      status: "open",
    };

    const [jobs, total] = await Promise.all([
      JobListingModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(
          "employerId",
          "companyName companyWebsite companyDescription industry companyLocation"
        ),

      JobListingModel.countDocuments(query),
    ]);

    return { jobs, total };
  };

  //filter job listings based on various criteria
  static filterJobListings = async ({
    location,
    workMode,
    experienceLevel,
    jobType,
    skills,
    isFilled = false,
    status = "open",
    minSalary,
    maxSalary,
    page = 1,
    limit = 10,
  }: jobFiltersSchemaInput): Promise<{
    jobs: DocumentType<JobListing>[];
    total: number;
  }> => {
    const filters: Record<string, any> = {};

    if (location) filters.location = { $regex: location, $options: "i" };
    if (workMode) filters.workMode = workMode;
    if (experienceLevel) filters.experienceLevel = experienceLevel;
    if (jobType) filters.jobType = jobType;
    if (skills?.length) filters.skills = { $in: skills };
    filters.isFilled = isFilled;
    if (status) filters.status = status;

    if (minSalary || maxSalary) {
      filters.salary = {};
      if (minSalary) filters.salary.$gte = minSalary;
      if (maxSalary) filters.salary.$lte = maxSalary;
    }

    const [jobs, total] = await Promise.all([
      JobListingModel.find(filters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(
          "employerId",
          "companyName companyWebsite companyDescription industry companyLocation"
        ),
      JobListingModel.countDocuments(filters),
    ]);

    return { jobs, total };
  };
}
