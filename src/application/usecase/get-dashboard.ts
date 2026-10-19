import type { SchedulingClient } from "../port/outbound/service-clients.js";

export interface Dashboard {
  pendingConflicts: number;
  draftSchedules: number;
}

// Caso de uso de agregacion (composicion cross-dominio para el shell web).
export class GetDashboard {
  constructor(private readonly scheduling: SchedulingClient) {}

  async handle(): Promise<Dashboard> {
    const [pendingConflicts, draftSchedules] = await Promise.all([
      this.scheduling.countPendingConflicts(),
      this.scheduling.countDraftSchedules(),
    ]);
    return { pendingConflicts, draftSchedules };
  }
}
