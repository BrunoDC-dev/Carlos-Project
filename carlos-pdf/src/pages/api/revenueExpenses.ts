// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
const bcrypt = require("bcryptjs");
import { MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import { data } from "autoprefixer";
const { v4: uuidv4 } = require("uuid");

type Data = {
  message?: string | any;
  error?: string;
  error2?: unknown;
  sessionId?: string;
  remember?: boolean;
};

const MONGODB_URI = process.env.MONGODB_URI!;
const queryMaker = async (database: string, filter: object) => {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as MongoClientOptions);
      const db = client.db();
  const result = await db.collection(database).find(filter).toArray();
  client.close
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
          const sesssion_query_result = await queryMaker("sessions", {
            owner_id: owner_id,
          });

          if (
            sesssion_query_result.length > 0 &&
            sesssion_query_result[0].sessionId == sessionId
          ) {
            const cars_id_array = owner_query_result[0].cars;
            let response: any = [];
            for (let index = 0; index < cars_id_array.length; index++) {
              const car_id = cars_id_array[index];
              const car_info_array = await queryMaker("cars", {
                _id: new ObjectId(car_id),
              });
              const car_revenue_array = await queryMaker("Revenue_Expenses", {
                car_id: car_id,
              });
              let total_Revenue = 0;
              let total_expenses = 0;
              for (let index = 0; index < car_revenue_array.length; index++) {
                const { expenses, revenue } = car_revenue_array[index];
                total_Revenue += parseFloat(revenue.toString());
                total_expenses += parseFloat(expenses.toString());
              }
              //console.log(car_revenue_array);
              let data = {
                car_name: car_info_array[0].car_name,
                driver_name: car_info_array[0].driver_name,
                registration_number: car_info_array[0].registration_number,
                revenue: total_Revenue,
                expenses: total_expenses,
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
