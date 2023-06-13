import mongoose, { Document, Model, model, Schema } from "mongoose";

export interface WorkSpaceDocument extends Document {
  companyName: string;
  country: string;
  city: string;
}
const WorkSpaceSchema = new Schema({
  companyName: {
    type: String,
    required: [true, "Please provide a name!"],
    unique: false
  },
  country: {
    type: String,
    unique: false,
    required: false,
  },
  city: {
    type: String,
    unique: false,
    required: false,
  }
})

const WorkSpace: Model<WorkSpaceDocument> = model<WorkSpaceDocument>("WorkSpace", WorkSpaceSchema);

export default WorkSpace;