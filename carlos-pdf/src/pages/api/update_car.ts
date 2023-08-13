import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import { couldStartTrivia } from "typescript";

type Data = {
  message?: string | any;
  error?: string;
  error2?: unknown;
  sessionId?: string;
  remember?: boolean;
};

const MONGODB_URI = process.env.MONGODB_URI!;

const updateMaker = async (
  db_name: string,
  filter: object,
  properties: object,
) => {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions);
  const db = client.db();

  try {
    await db.collection(db_name).updateOne(filter, properties);
  } finally {
    client.close();
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === "POST") {
    try {
      const { revenue } = req.body;
      const { expenses } = req.body;
      const { patente } = req.body;

      try {
        const car_update = await updateMaker(
          "cars",
          { registration_number: patente },
          {
            $set: { expenses: expenses, revenue: revenue },
          },
        );
        return res.status(200).json({ message: "exitos" });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Unhandled Error:", error);
      return res.status(500).json({ error: "Internal Server Error." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
