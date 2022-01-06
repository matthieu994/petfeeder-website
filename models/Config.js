import mongoose from 'mongoose';

export const SAMPLE_DOC = {
  _id: 0,
  createdAt: Date.now() - 1 * 60 * 60 * 1000,
  updatedAt: Date.now(),
  feed_on: ['12:00', '08:00', '22:00'],
  feed_now: true,
};

/* ConfigSchema will correspond to a collection in your MongoDB database. */
const ConfigSchema = new mongoose.Schema(
  {
    feed_on: {
      type: Array,
    },
    feed_now: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema);
