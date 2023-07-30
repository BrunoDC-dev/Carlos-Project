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

      if (!email || !sessionId) {
        return res.status(400).json({ error: "No session" });
      }

      try {
        const owner_query_result = await queryMaker("users", { email: email });

        if (owner_query_result.length > 0) {
          const owner_id = owner_query_result[0]._id;

          // Perform the join with the cars collection using the owner_id field
          const cars_join_options = {
            from: "cars",
            localField: "_id",
            foreignField: "owner_id",
            as: "cars_data",
          };

          const joinedResult = await queryMaker("users", { _id: owner_id }, [
            { $lookup: cars_join_options },
          ]);

          if (joinedResult.length > 0) {
            const cars_data = joinedResult[0].cars_data;
            // Process the joined data as needed
            let response: any = [];
            for (const car of cars_data) {
              const car_revenue_array = await queryMaker(
                "Revenue_Expenses",
                {
                  car_id: car._id,
                },
                [
                  { $sort: { date: -1 } }, // Sort by timestamp in descending order
                  { $limit: 2 }, // Limit to the two most recent documents
                ],
              );
              console.log(car_revenue_array);
              // Extract the most recent and previous revenue entries
              const recentRevenue = car_revenue_array[0]?.revenue || 0;
              const previousRevenue = car_revenue_array[1]?.revenue || 0;
              const recentExpenses = car_revenue_array[0]?.expenses || 0;
              const previousExpenses = car_revenue_array[1]?.expenses || 0;

              let data = {
                car_name: car.car_name,
                driver_name: car.driver_name,
                registration_number: car.registration_number,
                recent_revenue: parseFloat(recentRevenue.toString()),
                previous_revenue: parseFloat(previousRevenue.toString()),
                recentExpenses: parseFloat(recentExpenses.toString()),
                previousExpenses: parseFloat(previousExpenses.toString()),
              };
              response.push(data);
            }

            return res.status(200).json(response);
          }
        }

        return res.status(401).json({ error: "error" });
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
