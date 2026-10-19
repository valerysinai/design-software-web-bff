// Puertos de salida: el BFF agrega llamando a los servicios (nunca a su BD).
export interface SchedulingClient {
  countPendingConflicts(): Promise<number>;
  countDraftSchedules(): Promise<number>;
}
