// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
const bcrypt = require("bcryptjs");
import { MongoClient, MongoClientOptions, ObjectId } from "mongodb";
const { v4: uuidv4 } = require("uuid");
type Data = {
  message?: string;
  error?: string;
  error2?: unknown;
  sessionId?: string;
  remember?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;
      const { sessionId } = req.body;

      if (!email || !sessionId) {
        return res.status(400).json({ error: "No session" });
      }
      // Get the MongoDB connection string and ID from the environment variables
      const MONGODB_URI = process.env.MONGODB_URI!;

      // Connect to the MongoDB database
      const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as MongoClientOptions);
      const db = client.db();

      // Store the hashed password in the MongoDB collection with the given ID
      const result = await db
        .collection("users")
        .find({ email: email })
        .toArray();
      if (result.length > 0) {
        const objectId = result[0]._id;
        const resultSession = await db
          .collection("sessions")
          .find({ owner_id: objectId.toString() })
          .toArray();
        if (resultSession.length > 0) {
          if (resultSession[0].sessionId == sessionId) {
            return res.status(200).json({
              message: "Logueado.",
            });
          } else {
            return res.status(400).json({ error: "No session" });
          }
        } else {
          return res.status(401).json({ error: "No session" });
        }
      } else {
        return res.status(402).json({ error: "No session" });
      }
    } catch (error) {
      console.error("Unhandled Error:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
