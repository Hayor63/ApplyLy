import { Request, Response } from "express";
import Token from "../../../database/models/token";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";
import * as argon2 from "argon2";

// Function to verify if the provided token exists in the database
const verifyToken = async (userId: string, token: string) => {
  const storedToken = await Token.findOne({ userId });

  if (!storedToken) {
    return null;
  }

  // If tokens are hashed before storage, compare them properly
  const isValid = await argon2.verify(storedToken.token, token);
  return isValid ? storedToken : null;
};

const tokenHandler = async (req: Request, res: Response) => {
  try {
    const { userId, token } = req.params;

    // Validate if userId is present
    if (!userId || !token) {
      return APIResponse.error("User ID is required", 400).send(res);
    }

    // Check if the user exists
    const user = await UserRepo.findUserById(userId);
    console.log("User found:", user);

    if (!user) {
      return APIResponse.error("Invalid userId: User does not exist", 400).send(
        res
      );
    }

    if (user.isVerified) {
      return APIResponse.success(
        { message: "User already verified" },
        200
      ).send(res);
    }

    // Check if token is valid
    const validToken = await verifyToken(userId, token);
    console.log("token gotten", validToken);
    if (!validToken) {
      return APIResponse.error("Invalid or expired token", 401).send(res);
    }

    // update user as verified
    user.isVerified = true;
    await user.save();

    //cleean up used code
    await Token.deleteOne({ userId });

    // Send success response once verification is complete
    return APIResponse.success(
      { message: "Account verified successfully" },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default tokenHandler;
