import mongoose, { Document, Model, model, Schema } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  fullname?: string;
  username?: string;
  userImage: string;
  contactList?: Array<Schema.Types.ObjectId>;
  workSpaces?: Array<Schema.Types.ObjectId>;
  task?: Array<Schema.Types.ObjectId>;

}
const UserSchema = new Schema({
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
  userImage: {
    type: String,
    default:'https://i.imgur.com/hTZ2oxb.png',
  },
  contactList: {
    type: [Schema.Types.ObjectId],
    ref: "ContactList",
    required: false,
    sparse: true,
  },
  workSpaces: {
    type: [Schema.Types.ObjectId],
    ref: "WorkSpace",
    required: false,
    sparse: true,
  },
  tasks: {
    type: [Schema.Types.ObjectId],
    ref: "Task",
    required: false,
    sparse: true,
  },
});


const User: Model<UserDocument> = model<UserDocument>("User", UserSchema);

export default User;