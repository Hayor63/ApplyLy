import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import jobListingRepo from "../../../database/repo/jobListingRepo";

const fetchAllJobsHandler = async (req: Request, res: Response) => {
  try {
    const {
      pageNumber = "1",
      pageSize = "10",
      sortField,
      sortType,
      search,
      ...rest
    } = req.query;

    const page = Math.max(1, Number(pageNumber));
    const size = Math.max(1, Math.min(100, Number(pageSize)));

  
      const sortLogic =
        sortField && sortType
          ? {
              [sortField as string]: sortType as string | number,
            }
          : undefined;

    const { data, totalItems, totalPages } = await jobListingRepo.getPaginatedJobListing({
      pageNumber: page,
      pageSize: size,
      filter: rest,
      search: search as string,
      sortLogic,
    });

    return APIResponse.success(
      {
        message: "Jobs retrieved successfully",
        data,
        meta: {
          totalItems,
          totalPages,
          currentPage: page,
          pageSize: size,
        },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

  export default fetchAllJobsHandler