import { buildServer } from "../adapter/inbound/http/router.js";
import { HttpSchedulingClient } from "../adapter/outbound/client/scheduling-client.js";
import { GetDashboard } from "../application/usecase/get-dashboard.js";

// Composition root del contenedor.
const edgeUrl = process.env.EDGE_URL ?? "http://gateway";
const getDashboard = new GetDashboard(new HttpSchedulingClient(edgeUrl));
const port = Number(process.env.PORT ?? 8080);
buildServer(getDashboard).listen(port, () => console.log(`web-bff on :${port}`));
