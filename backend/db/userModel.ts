import mongoose, { Document, Model } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  fullname: string;
  username: string;
  workSpaces: string[];
}
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
  fullname: {
    type: String,
    unique: false,
    required: false,
  },
  username: {
    type: String,
    unique: true,
    required: false,
  },
  workSpaces: {
    type: Array,
    unique: false,
    required: false,
  },
})

const User: Model<UserDocument> = mongoose.model<UserDocument>("User", UserSchema);

export default User;