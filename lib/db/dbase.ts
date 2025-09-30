import mongoose from "mongoose";

const globalWithMongoose = global as typeof global & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

export const connectDB = async (): Promise<string> => {
  if (cached.conn) {
    return "Already connected to database";
  }

  if (!process.env.MONGO_URI_IBYTRADE_GOAPI) {
    throw new Error("MONGO_URI_IBYTRADE_GOAPI is not defined in the environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI_IBYTRADE_GOAPI!)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return "Connected to database with success";
};