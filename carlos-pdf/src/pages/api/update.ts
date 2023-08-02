import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, MongoClientOptions, ObjectId } from "mongodb";

type Data = {
  message?: string | any;
  error?: string;
  error2?: unknown;
  sessionId?: string;
  remember?: boolean;
};

const MONGODB_URI = process.env.MONGODB_URI!;

// Define custom type for aggregation pipeline stages
type AggregationPipelineStage =
  | { $match: object }
  | { $lookup: object }
  | { $sort: object }
  | { $limit: number };

const queryMaker = async (
  database: string,
  filter: object,
  pipeline: AggregationPipelineStage[] = [],
) => {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions);
  const db = client.db();

  const aggregationPipeline = [...pipeline, { $match: filter }];

  const result = await db
    .collection(database)
    .aggregate(aggregationPipeline)
    .toArray();
  client.close();
  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;
      const { sessionId } = req.body;
      const {revenue} = req.body
      const {expenses} = req.body
        console.log(req.body)
      if (!email || !sessionId) {
        return res.status(403).json({ error: "No session" });
      }

      try {
      
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
