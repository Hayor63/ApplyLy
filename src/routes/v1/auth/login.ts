import { Request, Response } from "express";
import UserRepo from "../../../database/repo/userRepo";
import APIResponse from "../../../utils/api";
import JWTRepo from "../../../database/repo/JWTRepo";
import { formatResponseRecord } from "../../../utils/formatter";

const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return APIResponse.error("Email and password are required", 400).send(
        res
      );
    }
    //validate email and password
    const user = await UserRepo.findUserByEmail(email);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }
  

    if (!user.isVerified) {
      return APIResponse.error(
        "Please verify your email before logging in.",
        403
      ).send(res);
    }

    const isPasswordValid = await user.verifyPassword(password);
 
    if (!isPasswordValid) {
      return APIResponse.error("Invalid email or password", 401).send(res);
    }
    //genterate JWT token
    const { password: _, ...rest } = user.toObject();
    const accessToken = JWTRepo.signAccessToken(rest);

    //return success response
    return APIResponse.success(
      { accessToken, ...formatResponseRecord(rest) },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default loginHandler;
