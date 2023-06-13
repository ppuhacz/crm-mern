import mongoose, { Document, Model, model, Schema } from "mongoose";

const ContactSchema = new mongoose.Schema({
  usernames: [String],
  username: String,
  requesterId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  addedTimestamp: Date,
  status: String,
});

export const Contact = mongoose.model('Contact', ContactSchema);

const ContactRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username:{type: String},
});

export const ContactRequest = mongoose.model('ContactRequest', ContactRequestSchema);