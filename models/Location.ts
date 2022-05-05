import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: [true, 'Por favor, informe um estado'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Por favor, informe uma cidade'],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Location', LocationSchema);
