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
  
    try {
      const aggregationPipeline = [...pipeline, { $match: filter }];
      const result = await db
        .collection(database)
        .aggregate(aggregationPipeline)
        .toArray();
      return result;
    } finally {
      client.close();
    }
  };

  const inserMaker = async (db_name: string, properties: object) => {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as MongoClientOptions);
    const db = client.db();
  
    try {
      await db.collection(db_name).insertOne(properties);
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
      const { caja_before } = req.body;
      const { caja_after } = req.body;
        const { revenue_total } = req.body;
        const { expenses_total } = req.body;

      try {
       
     
        const balance_insert = await inserMaker("Balance", {
            date: new Date().getTime(),
            caja_before: caja_before,
            caja_after: caja_after,
            revenue: revenue_total,
            expenses: expenses_total,
            diferencia: revenue_total- expenses_total,
          });
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
