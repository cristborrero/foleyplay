import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const uri = MONGODB_URI || 'mongodb://localhost:27017/dummy_build_db';
    
    try {
      cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
        return mongoose;
      }).catch(err => {
        console.warn('MongoDB connection warning (ignored during build):', err.message);
        return null;
      });
    } catch (e: any) {
      console.warn('MongoDB synchronous error (ignored):', e.message);
      cached.promise = Promise.resolve(null);
    }
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.warn('MongoDB connection failed:', e);
  }
  
  return cached.conn;
}

export default dbConnect;