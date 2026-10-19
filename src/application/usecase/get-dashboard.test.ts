import { test } from "node:test";
import assert from "node:assert/strict";
import { GetDashboard } from "./get-dashboard.js";
import type { SchedulingClient } from "../port/outbound/service-clients.js";

const fakeScheduling: SchedulingClient = {
  countPendingConflicts: async () => 3,
  countDraftSchedules: async () => 2,
};

test("aggregates scheduling widgets for the web dashboard", async () => {
  const uc = new GetDashboard(fakeScheduling);
  const d = await uc.handle();
  assert.equal(d.pendingConflicts, 3);
  assert.equal(d.draftSchedules, 2);
});
