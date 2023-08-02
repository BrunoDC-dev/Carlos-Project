// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
const bcrypt = require("bcryptjs");
import { MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import { timeStamp } from "console";
import { cookies } from "next/dist/client/components/headers";
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
      const { password } = req.body;
      const { email } = req.body;
      const { session } = req.body;

      // Ensure that the password is provided
      if (!password) {
        return res.status(400).json({ error: "Password is required." });
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
        let compare = await bcrypt.compare(password, result[0].password);
        if (compare) {
          const objecId = result[0]._id;

          const sessionId = uuidv4();
          const session_created = await db.collection("sessions").updateOne(
            { owner_id: objecId },
            {
              $set: {
                sessionId: sessionId,
                owner_id: objecId,
                timestamp: Date.now(),
              },
            },
            { upsert: true },
          );
          client.close();
          if (session) {
            return res.status(200).json({
              message: "Logueado.",
              sessionId: sessionId,
              remember: true,
            });
          }
          return res.status(200).json({
            message: "Logueado.",
            sessionId: sessionId,
            remember: false,
          });
        } else {
          return res.status(403).json({ message: "incorrecta Contrasenas." });
        }
      } else {
        client.close();
        return res.status(403).json({ message: "incorrecta Email." });
      }
    } catch (error) {
      console.error("Unhandled Error:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
