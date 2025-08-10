import { DocumentType } from "@typegoose/typegoose";
import { CreateUserInput } from "../../validationSchema/user";
import UserModel, { User } from "../models/userModel";
import TokenModel from "../models/token";

export default class UserRepo {
  static createUser: (user: CreateUserInput) => Promise<DocumentType<User>> =
    async (user) => {
      return await UserModel.create(user);
    };

  //find user by email
  static findUserByEmail = async (
    email: string
  ): Promise<DocumentType<User> | null> => {
    const user = await UserModel.findOne({ email }).select("+password").exec();
    console.log("User found:", user);
    return user as DocumentType<User> | null;
  };

  //find user by fullName
  static findUserByfullName: (
    fullName: string
  ) => Promise<DocumentType<User> | null> = async (fullName) => {
    return await UserModel.findOne({ fullName });
  };

  //find by Id
  static findUserById = async (
    id: string
  ): Promise<DocumentType<User> | null> => {
    return await UserModel.findById(id).select("+password").exec();
  };

  //verify Email
  static async verifyEmail(
    userId: string,
    token: string
  ): Promise<DocumentType<User> | null> {
    return await TokenModel.findOne({ userId, token });
  }

  //update USer Profile
  static updateUserProfile: (
    id: string,
    updateParams: Partial<User>
  ) => Promise<Omit<User, "password"> | null> = async (id, updateParams) => {
    const { password, ...rest } = updateParams;
    const updatedUser = await UserModel.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    }).select("-password");

    return updatedUser;
  };
}
