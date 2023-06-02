import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  fullname?: string;
  username?: string;
  workSpaces?: Array<Schema.Types.ObjectId>;
  task?: Array<Schema.Types.ObjectId>;
}
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email already exists!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
  },
  fullname: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    validate: {
      validator: async function (value: string) {
        const count = await mongoose.models.User.countDocuments({ username: value });
        return count === 0;
      },
      message: "Username already exists!",
    },
  },
  workSpaces: {
    type: Schema.Types.ObjectId,
    ref: "WorkSpace",
    required: false,
  },
  tasks: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: false,
  },
});


const User: Model<UserDocument> = mongoose.model<UserDocument>("User", UserSchema);

export default User;