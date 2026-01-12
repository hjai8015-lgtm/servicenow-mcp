import "dotenv/config";
import express from "express";
import { getMyIncidents, createIncident } from "./servicenow.js";
import { searchHelp } from "./help.js";
const app = express();
app.use(express.json());
/* Health check */
app.get("/", (_req, res) => {
    res.json({ status: "ServiceNow Assistant API running" });
});
/* Get incidents */
app.get("/incidents", async (_req, res) => {
    const data = await getMyIncidents();
    res.json(data);
});
/* Create incident */
app.post("/incidents", async (req, res) => {
    const { short_description } = req.body;
    const data = await createIncident(short_description);
    res.json(data);
});
/* Search help */
app.post("/help", (req, res) => {
    const { query } = req.body;
    const data = searchHelp(query);
    res.json(data);
});
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`HTTP API running on port ${PORT}`);
});
