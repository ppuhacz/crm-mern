import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username:{type: String},
});

export const Contact = mongoose.model('Contact', ContactSchema);

const ContactRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username:{type: String},
});

export const ContactRequest = mongoose.model('ContactRequest', ContactRequestSchema);