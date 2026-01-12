import "dotenv/config";
import express, { Request, Response } from "express";


import { getMyIncidents, createIncident } from "./servicenow.js";
import { searchHelp } from "./help.js";

const app = express();
app.use(express.json());

/* Health check */
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ServiceNow Assistant API running" });
});

/* Get incidents */
app.get("/incidents", async (_req: Request, res: Response) => {
  const data = await getMyIncidents();
  res.json(data);
});

/* Create incident */
app.post("/incidents", async (req: Request, res: Response) => {
  const { short_description } = req.body as { short_description: string };
  const data = await createIncident(short_description);
  res.json(data);
});

/* Search help */
app.post("/help", (req: Request, res: Response) => {
  const { query } = req.body as { query: string };
  const data = searchHelp(query);
  res.json(data);
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`HTTP API running on port ${PORT}`);
});

