// models/submodels/SocialLinks.ts
import { prop } from "@typegoose/typegoose";

export class SocialLinks {
  @prop()
  portfolio?: string;

  @prop()
  github?: string;

  @prop()
  linkedin?: string;

  @prop()
  twitter?: string;

  @prop()
  instagram?: string;
}
