import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now, // Fallback in case Clerk does not provide created_at
    },
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

const User = models?.User || model("User", UserSchema);

export default User;
