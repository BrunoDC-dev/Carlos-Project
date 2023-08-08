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

const updateMaker = async (
  db_name: string,
  filter: object,
  property: object,
) => {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions);
  const db = client.db();

  try {
    await db.collection(db_name).updateOne(filter, { $set: property });
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
      const { revenue } = req.body;
      const { expenses } = req.body;
      const { caja } = req.body;
      console.log(req.body);

      try {
        const session_join_options = {
          from: "sessions",
          localField: "_id",
          foreignField: "owner_id",
          as: "session_data",
        };
            let gastoTotal = 0;
            let revenueTotal = 0;
            for (const patente in expenses) {
              revenueTotal += revenue[patente];
              let gastoDecadaAuto = 0;
              for (const gasto in expenses[patente]) {
                gastoTotal += expenses[patente][gasto];
                gastoDecadaAuto += expenses[patente][gasto];
              }
              let car_query_result = await queryMaker("cars", {
                registration_number: patente,
              });
              console.log(car_query_result);
              let car_id = car_query_result[0]._id;
              const reveuenInsert = await inserMaker("Revenue_Expenses", {
                car_id: car_id,
                revenue: revenue[patente],
                expenses: gastoDecadaAuto,
                date: new Date().getTime(),
              });
            }
            const caja_mongo = caja + revenueTotal - gastoTotal;

            const balance_insert = await inserMaker("Balance", {
              date: new Date().getTime(),
              caja_before: caja,
              caja_after: caja_mongo,
              revenue: revenueTotal,
              expenses: gastoTotal,
              diferencia: revenueTotal - gastoTotal,
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
