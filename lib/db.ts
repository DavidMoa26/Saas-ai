import mongoose from 'mongoose';

export const connectDB = async () => {

  const db_uri = process.env.MONGO_URI;

  if (!db_uri) throw new Error('No db_uri found');

  try {
    await mongoose.connect(db_uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
  }
};