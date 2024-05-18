import mongoose from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  preferences: string[];
}

const Schema = mongoose.Schema;
const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    type: [String],
    required: false,
  }
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
