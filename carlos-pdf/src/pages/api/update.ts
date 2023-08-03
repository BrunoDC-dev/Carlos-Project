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
      const { email } = req.body;
      const { sessionId } = req.body;
      const { revenue } = req.body;
      const { expenses } = req.body;
      const { caja } = req.body;
      console.log(req.body);
      if (!email || !sessionId) {
        return res.status(403).json({ error: "No session" });
      }

      try {
        const session_join_options = {
          from: "sessions",
          localField: "_id",
          foreignField: "owner_id",
          as: "session_data",
        };
        const owner_query_result = await queryMaker("users", { email: email }, [
          { $lookup: session_join_options },
        ]);
        if (owner_query_result.length > 0) {
          if (owner_query_result[0].session_data[0].sessionId == sessionId) {
            let gastoTotal = 0;
            let revenueTotal = 0;
            for (const patente in expenses) {
              const cars_update = await updateMaker(
                "cars",
                { registration_number: patente },
                { expenses: expenses[patente], revenue: revenue[patente] },
              );
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
            const user_update = await updateMaker(
              "users",
              { email: email },
              { money: caja_mongo },
            );
            const balance_insert = await inserMaker("Balance", {
              date: new Date().getTime(),
              caja_before: caja,
              caja_after: caja_mongo,
              revenue: revenueTotal,
              expenses: gastoTotal,
              diferencia: revenueTotal - gastoTotal,
            });
          }
        }
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
