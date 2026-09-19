import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";

dotenv.config();

const { DATABASE_URI } = process.env;
const PORT = process.env.PORT || 5300;

if (!DATABASE_URI) {
  console.error("No DATABASE_URI environment variable has been defined in .env");
  process.exit(1);
}

connectToDatabase(DATABASE_URI)
  .then(() => {
    const app = express();
    
    app.use(cors());
    app.use(express.json()); // Ensures incoming JSON request bodies are parsed correctly

    app.use("/employees", employeeRouter);

    app.get("/healthcheck", (_req, res) => {
      res.status(200).send({ status: "ok" });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  })
  .catch((error) => console.error(error));