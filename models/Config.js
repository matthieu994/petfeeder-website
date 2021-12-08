import mongoose from 'mongoose';

/* ConfigSchema will correspond to a collection in your MongoDB database. */
const ConfigSchema = new mongoose.Schema(
  {
    feed_on: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema);
