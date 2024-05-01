import mongoose, { Connection } from 'mongoose';

interface Global {
  mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

declare var global: Global;

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

// Ensuring the global.mongoose has the type specified in types.d.ts
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Connection | null> {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    global.mongoose.promise = mongoose.connect(MONGO_URI, opts).then(() => {
      return mongoose.connection;
    });
  }
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default dbConnect;
