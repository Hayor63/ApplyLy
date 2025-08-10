import { updateJobSeekerProfileSchema } from './../../validationSchema/jobSeeker';
import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import jobRoutes from "./jobSeeker";
import employerRoutes from "./employer";
import jobListingRoutes from './jobListing';
import bookmarkRoutes from './bookmark';
import jobApplicationRoutes from './jobApplication';
import applicantRoutes from './jobSeeker';

const router = Router()

router.use("/users", userRoutes)
router.use("/auth", authRoutes)
router.use("/applicant", applicantRoutes)
router.use("/employer", employerRoutes)
router.use("/jobListing", jobListingRoutes)
router.use("/bookmark", bookmarkRoutes)
router.use("/jobApplication", jobApplicationRoutes)


export default router



