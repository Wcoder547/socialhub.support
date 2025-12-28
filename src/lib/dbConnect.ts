    // lib/mongodb.ts
    import mongoose from "mongoose";

    const MONGODB_URI = process.env.MONGODB_URI as string;

    if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env");
    }

    type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    };

    declare global {
    var mongoose: MongooseCache | undefined;
    }

    // Use global cache so Next.js hot reload doesn't create many connections
    let cached = global.mongoose as MongooseCache | undefined;

    if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
    }

    export async function dbConnect(): Promise<typeof mongoose> {
    if (cached!.conn) {
        // console.log("MongoDB: using existing connection");
        return cached!.conn;
    }

    if (!cached!.promise) {
        // console.log("MongoDB: creating new connection");
        cached!.promise = mongoose
        .connect(MONGODB_URI, {
            // add options here if needed
        })
        .then((mongooseInstance) => mongooseInstance);
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (err) {
        cached!.promise = null;
        console.error("MongoDB connection error:", err);
        throw err;
    }

    return cached!.conn;
    }
