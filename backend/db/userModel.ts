import mongoose, { Document, Model } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
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
  }
})

const User: Model<UserDocument> = mongoose.model<UserDocument>("User", UserSchema);

export default User;