// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
const  bcrypt = require("bcryptjs");
import { MongoClient, MongoClientOptions , ObjectId  } from "mongodb";

type Data = {
    message?: string;
    error?: string;
    error2?: unknown;
  };
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
  ) {
    if (req.method === "POST") {
      try {
        const { password } = req.body;
        const { email }= req.body
  
        // Ensure that the password is provided
        if (!password || !email) {
          return res.status(400).json({ error: "Password is required." });
        }
  
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  
        // Get the MongoDB connection string and ID from the environment variables
        const MONGODB_URI = process.env.MONGODB_URI!;
  
        // Connect to the MongoDB database
        const client = await MongoClient.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          } as MongoClientOptions);
        const db = client.db();
  
        // Store the hashed password in the MongoDB collection with the given ID
        await db.collection("users").updateOne(
          { email: email },
          { $set: { password: hashedPassword } },
          { upsert: true } // Create a new document if it doesn't exist
        );
  
        // Close the MongoDB connection
        client.close();
  
        // Respond with success
        return res.status(200).json({ message: "Password stored successfully." });
      } catch (error) {
        console.error("Unhandled Error:", error);
        return res.status(500).json({ error: "Internal Server Error." });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed." });
    }
  }