import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import JobListingModel from "../../../database/models/jobListing";
import JobApplicationRepo from "../../../database/repo/jobApplicationRepo";
import JobSeekerModel from "../../../database/models/jobSeekerProfile";
import JobApplicationModel from "../../../database/models/jobApplication";
import mongoose, { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const createJobApplicationHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { coverLetter, resume } = req.body;
  const { jobId } = req.params;
  const userId = req.user?._id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return APIResponse.error("Authentication required", 401).send(res);
  }

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    return APIResponse.error("Invalid Job ID", 400).send(res);
  }

  if (!coverLetter?.trim()) {
    return APIResponse.error("Cover letter is required", 400).send(res);
  }

  try {
    //Get the actual applicant (job seeker) ID from their userId
    const jobSeeker = await JobSeekerModel.findOne({ userId });
    if (!jobSeeker) {
      return APIResponse.error("Job seeker profile not found", 404).send(res);
    }

    const applicantId = jobSeeker._id;

    //Get job details
    const job = await JobListingModel.findById(jobId);
    if (!job) {
      return APIResponse.error("Job not found", 404).send(res);
    }

    // Prevent duplicate applications
    const existing = await JobApplicationModel.findOne({ jobId, applicantId });
    if (existing) {
      return APIResponse.error("You have already applied for this job", 400).send(res);
    }

    //Create application
    const application = await JobApplicationRepo.createJobApplication({
      applicantId: applicantId,
      employerId: job.employerId,
      jobId: new Types.ObjectId(jobId),
      status: "pending",
      coverLetter: coverLetter.trim(),
      resume: resume?.trim() || null,
    });

    //Update application count
    await JobListingModel.findByIdAndUpdate(
      jobId,
      { $inc: { applicationCount: 1 } },
      { new: true }
    );

    return APIResponse.success(
      {
        message: "Job application submitted successfully",
        data: application,
      },
      201
    ).send(res);

  } catch (error) {
    return APIResponse.error("Server error", 500).send(res);
  }
};

export default createJobApplicationHandler;
