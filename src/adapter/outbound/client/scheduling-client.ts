import type { SchedulingClient } from "../../../application/port/outbound/service-clients.js";

// Adapter de salida hacia scheduling-service (a traves del edge). Skeleton.
export class HttpSchedulingClient implements SchedulingClient {
  constructor(private readonly baseUrl: string) {}
  async countPendingConflicts(): Promise<number> {
    // TODO: GET {baseUrl}/scheduling/conflicts?status=pending (con traceparent)
    return 0;
  }
  async countDraftSchedules(): Promise<number> {
    // TODO: GET {baseUrl}/scheduling/schedules?status=DRAFT
    return 0;
  }
}
