import { Request, Response } from "express";
import jobListingRepo from "../../../database/repo/jobListingRepo";
import APIResponse from "../../../utils/api";

 const filterJobListingsHandler = async (req: Request, res: Response) => {
  try {
    const filters = req.query as any;

    const result = await jobListingRepo.filterJobListings(filters);

    if (!result || result.jobs.length === 0) {
      return APIResponse.success({
        total: 0,
        results: [],
        message: "No job listings found for the applied filters.",
      }).send(res); 
    }

    return APIResponse.success({
      message: "Job listings retrieved successfully.",
      total: result.total,
      results: result.jobs,
      appliedFilters: filters,
    }).send(res); // ✅ Also here
  } catch (err: any) {
    return APIResponse.error("Something went wrong while filtering jobs", 500).send(res);
  }
};

export default filterJobListingsHandler