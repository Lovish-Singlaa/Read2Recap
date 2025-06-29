import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: '',
  },
  audioUrl: {
    type: String,
    default: '',
  },
  // status: {
  //   type: String,
  //   enum: ['pending', 'processing', 'completed', 'error'],
  //   default: 'pending',
  // },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
});

export default mongoose.models.Document || mongoose.model('Document', documentSchema); 