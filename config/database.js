import mongoose from "mongoose";
import {} from "dotenv/config";

var URL = process.env.MONGODB_CONNECTION_URL;

export const connectToDataBase = () => {
  mongoose
    .connect(URL)
    .then(() => console.log(`database connected....`))
    .catch((err) => console.log(err));
};
