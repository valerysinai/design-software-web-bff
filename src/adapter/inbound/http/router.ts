import { createServer, type Server, type ServerResponse } from "node:http";
import { GetDashboard } from "../../../application/usecase/get-dashboard.js";

const localSession = {
  id: "00000000-0000-4000-8000-000000000000",
  email: "usuario@example.invalid",
  full_name: "Usuario de desarrollo",
  actor_type: "USER",
  roles: [],
  features: [],
  modules: [
    "MOD_DASHBOARD",
    "MOD_SCHEDULING",
    "MOD_ACADEMIC",
    "MOD_ENVIRONMENT",
    "MOD_ACTORS",
    "MOD_MONITORING",
    "MOD_IDENTITY",
    "MOD_REFERENCE",
    "MOD_DOCUMENTS",
    "MOD_AUDIT",
  ],
};

const localNotification = {
  id: "local-notification-1",
  recipient_id: localSession.id,
  subject: "Backend local conectado",
  body_summary: "El shell esta consumiendo el BFF local por HTTP.",
  send_status: "SENT",
  channel: "IN_APP",
  created_at: "2026-10-14T00:00:00.000Z",
  sent_at: "2026-10-14T00:00:00.000Z",
};

const localTimeSlots = [
  {
    id: "slot-monday-morning",
    name: "Lunes manana",
    day_of_week: 1,
    start_time: "07:00",
    end_time: "12:00",
    shift: "DAY",
    created_at: "2026-10-14T00:00:00.000Z",
    updated_at: "2026-10-14T00:00:00.000Z",
  },
  {
    id: "slot-monday-afternoon",
    name: "Lunes tarde",
    day_of_week: 1,
    start_time: "13:00",
    end_time: "18:00",
    shift: "DAY",
    created_at: "2026-10-14T00:00:00.000Z",
    updated_at: "2026-10-14T00:00:00.000Z",
  },
  {
    id: "slot-tuesday-night",
    name: "Martes noche",
    day_of_week: 2,
    start_time: "18:00",
    end_time: "22:00",
    shift: "NIGHT",
    created_at: "2026-10-14T00:00:00.000Z",
    updated_at: "2026-10-14T00:00:00.000Z",
  },
];

const localFichas = [
  {
    id: "ficha-2874412",
    ficha_number: "2874412",
    program_id: "program-adso",
    program_version: "1",
    training_center_id: "centro-formacion",
    status: "EXECUTION",
    start_date: "2026-02-01",
    expected_end_date: "2027-06-30",
    actual_end_date: null,
    training_shift: "DAY",
    training_modality: "IN_PERSON",
    max_capacity: 35,
    created_at: "2026-10-14T00:00:00.000Z",
    updated_at: "2026-10-14T00:00:00.000Z",
  },
  {
    id: "ficha-3011550",
    ficha_number: "3011550",
    program_id: "program-sistemas",
    program_version: "2",
    training_center_id: "centro-formacion",
    status: "INDUCTION",
    start_date: "2026-09-01",
    expected_end_date: "2028-03-30",
    actual_end_date: null,
    training_shift: "MIXED",
    training_modality: "HYBRID",
    max_capacity: 30,
    created_at: "2026-10-14T00:00:00.000Z",
    updated_at: "2026-10-14T00:00:00.000Z",
  },
];

const localKpiTypes = [
  { id: "mock-kpi-attendance", code: "ATTENDANCE", name: "Asistencia", description: "Porcentaje de asistencia de la ficha.", unit: "PERCENTAGE", is_active: true },
  { id: "mock-kpi-progress", code: "CURRICULUM_PROGRESS", name: "Avance curricular", description: "Avance frente al plan curricular.", unit: "PERCENTAGE", is_active: true },
  { id: "mock-kpi-follow-up", code: "FOLLOW_UP_COUNT", name: "Seguimientos realizados", description: "Cantidad de seguimientos registrados.", unit: "COUNT", is_active: true },
];

const localAlertTypes = [
  { id: "mock-alert-attendance", code: "LOW_ATTENDANCE", name: "Baja asistencia", description: "La asistencia esta por debajo del umbral configurado.", default_threshold: 80, threshold_unit: "PERCENTAGE", affects_ficha_status: true, is_active: true },
  { id: "mock-alert-progress", code: "LOW_PROGRESS", name: "Bajo avance curricular", description: "El avance curricular requiere revision.", default_threshold: 60, threshold_unit: "PERCENTAGE", affects_ficha_status: true, is_active: true },
];

const localRiskLevels = [
  { id: "mock-risk-low", code: "LOW", label: "Bajo", color_hex: "#12B76A", priority_order: 4 },
  { id: "mock-risk-medium", code: "MEDIUM", label: "Medio", color_hex: "#F79009", priority_order: 3 },
  { id: "mock-risk-critical", code: "CRITICAL", label: "Critico", color_hex: "#B42318", priority_order: 1 },
];

const localKpiStatuses = [
  { id: "mock-status-on-track", code: "ON_TRACK", description: "En seguimiento", risk_level_id: "mock-risk-low" },
  { id: "mock-status-at-risk", code: "AT_RISK", description: "En riesgo", risk_level_id: "mock-risk-medium" },
  { id: "mock-status-critical", code: "CRITICAL", description: "Critico", risk_level_id: "mock-risk-critical" },
];

const localKpiTrackings = [
  {
    id: "mock-kpi-tracking-1",
    ficha_tracking_id: "ficha-2874412",
    kpi_type_id: "mock-kpi-attendance",
    current_value: 78,
    threshold_value: 80,
    kpi_status_id: "mock-status-at-risk",
    period_start: "2026-09-01",
    period_end: "2026-09-30",
    measured_at: "2026-10-01T10:00:00Z",
  },
];

const localFichaTrackings = [
  {
    id: "mock-tracking-1",
    ficha_id: "ficha-2874412",
    assigned_instructor_id: "instructor-local",
    overall_status_id: "mock-status-at-risk",
    active_alert_count: 2,
    last_tracking_date: "2026-07-10",
    next_tracking_date: "2026-08-10",
    created_at: "2026-03-01T08:00:00Z",
  },
  {
    id: "mock-tracking-2",
    ficha_id: "ficha-3011550",
    assigned_instructor_id: "instructor-local",
    overall_status_id: "mock-status-on-track",
    active_alert_count: 0,
    last_tracking_date: null,
    next_tracking_date: null,
    created_at: "2026-03-05T08:00:00Z",
  },
];

const localTrackingSessions = [
  {
    id: "mock-session-1",
    ficha_tracking_id: "mock-tracking-1",
    instructor_id: "instructor-local",
    session_date: "2026-07-10",
    session_type: "ACADEMIC",
    attendance_count: 18,
    total_learners: 20,
    attendance_percentage: 90,
    curriculum_progress_percentage: 65,
    observations: "Avance segun lo planeado.",
    requires_follow_up: false,
    created_at: "2026-07-10T10:00:00Z",
  },
  {
    id: "mock-session-2",
    ficha_tracking_id: "mock-tracking-1",
    instructor_id: "instructor-local",
    session_date: "2026-07-03",
    session_type: "PROJECT",
    attendance_count: 16,
    total_learners: 20,
    attendance_percentage: 80,
    curriculum_progress_percentage: 60,
    observations: "Se detectan aprendices con ausencias.",
    requires_follow_up: true,
    created_at: "2026-07-03T10:00:00Z",
  },
];

const localGeneratedAlerts = [
  {
    id: "mock-generated-alert-1",
    ficha_tracking_id: "mock-tracking-1",
    alert_type_id: "mock-alert-attendance",
    status: "OPEN",
    severity: "MEDIUM",
    message: "La ficha requiere seguimiento por asistencia.",
    generated_at: "2026-10-01T10:00:00Z",
    resolved_at: null,
  },
];

const localImprovementPlans = [
  {
    id: "mock-plan-1",
    generated_alert_id: "mock-generated-alert-1",
    title: "Plan de asistencia",
    description: "Contactar aprendices con ausencias y programar refuerzo.",
    status: "OPEN",
    due_date: "2026-10-30",
    created_at: "2026-10-01T10:00:00Z",
  },
];

function page<T>(data: T[], pageSize = 20) {
  return {
    data,
    pagination: {
      page: 1,
      page_size: pageSize,
      total_items: data.length,
      total_pages: Math.max(1, Math.ceil(data.length / pageSize)),
    },
  };
}

function cursorPage<T>(data: T[]) {
  return {
    data,
    pagination: { next_cursor: null, limit: 50, has_more: false },
  };
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    "access-control-allow-origin": "http://localhost:5000",
    "access-control-allow-credentials": "true",
    "access-control-allow-headers": "authorization,content-type,accept",
    "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
    "content-type": "application/json",
  });
  res.end(JSON.stringify(body));
}

function sendNoContent(res: ServerResponse): void {
  res.writeHead(204, {
    "access-control-allow-origin": "http://localhost:5000",
    "access-control-allow-credentials": "true",
    "access-control-allow-headers": "authorization,content-type,accept",
    "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
  });
  res.end();
}

// Adapter de entrada HTTP (stdlib, sin framework pesado en el skeleton).
export function buildServer(getDashboard: GetDashboard): Server {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const path = url.pathname.replace(/^\/api\/v1(?=\/|$)/, "") || "/";

    if (req.method === "OPTIONS") {
      sendJson(res, 204, {});
      return;
    }

    if (path === "/") {
      sendJson(res, 200, {
        name: "web-bff",
        status: "ok",
        endpoints: ["/api/v1/health", "/api/v1/auth/me", "/api/v1/dashboard"],
      });
      return;
    }

    if (path === "/health") {
      sendJson(res, 200, { status: "ok" });
      return;
    }
    if (path === "/auth/me" && req.method === "GET") {
      sendJson(res, 200, localSession);
      return;
    }
    if (path === "/auth/logout" && req.method === "POST") {
      res.writeHead(204, {
        "access-control-allow-origin": "http://localhost:5000",
        "access-control-allow-credentials": "true",
      });
      res.end();
      return;
    }
    if (path === "/notifications/local-notification-1" && req.method === "GET") {
      sendJson(res, 200, localNotification);
      return;
    }
    if (path === "/dashboard" && req.method === "GET") {
      const data = await getDashboard.handle();
      sendJson(res, 200, data);
      return;
    }
    if (path === "/time-slots" && req.method === "GET") {
      sendJson(res, 200, localTimeSlots);
      return;
    }
    if (path === "/time-slots" && req.method === "POST") {
      sendJson(res, 201, { ...localTimeSlots[0], id: `slot-local-${Date.now()}` });
      return;
    }
    if (path.startsWith("/time-slots/") && req.method === "PUT") {
      sendJson(res, 200, { ...localTimeSlots[0], id: decodeURIComponent(path.split("/").at(-1) ?? localTimeSlots[0].id) });
      return;
    }
    if (path.startsWith("/time-slots/") && req.method === "DELETE") {
      sendNoContent(res);
      return;
    }
    if (path === "/fichas" && req.method === "GET") {
      sendJson(res, 200, page(localFichas));
      return;
    }
    if (path.startsWith("/fichas/") && req.method === "GET") {
      const id = decodeURIComponent(path.split("/").at(-1) ?? "");
      const ficha = localFichas.find((item) => item.id === id || item.ficha_number === id);
      sendJson(res, ficha ? 200 : 404, ficha ?? { error_code: "NOT_FOUND", message: "Ficha no encontrada" });
      return;
    }
    if (path === "/kpi-types" && req.method === "GET") {
      sendJson(res, 200, page(localKpiTypes));
      return;
    }
    if (path === "/alert-types" && req.method === "GET") {
      sendJson(res, 200, page(localAlertTypes));
      return;
    }
    if (path === "/risk-levels" && req.method === "GET") {
      sendJson(res, 200, localRiskLevels);
      return;
    }
    if (path === "/kpi-statuses" && req.method === "GET") {
      sendJson(res, 200, localKpiStatuses);
      return;
    }
    if (path === "/kpi-trackings" && req.method === "GET") {
      sendJson(res, 200, cursorPage(localKpiTrackings));
      return;
    }
    if (path === "/kpi-trackings" && req.method === "POST") {
      sendJson(res, 201, { ...localKpiTrackings[0], id: `mock-kpi-tracking-${Date.now()}` });
      return;
    }
    if (path.startsWith("/kpi-trackings/") && req.method === "GET") {
      const id = decodeURIComponent(path.split("/").at(-1) ?? "");
      const tracking = localKpiTrackings.find((item) => item.id === id);
      sendJson(res, tracking ? 200 : 404, tracking ?? { error_code: "NOT_FOUND", message: "Medicion KPI no encontrada" });
      return;
    }
    if (path === "/reports/kpi-summary" && req.method === "GET") {
      sendJson(res, 200, page(localKpiTrackings.map((item) => ({
        ficha_tracking_id: item.ficha_tracking_id,
        kpi_type_code: "ATTENDANCE",
        kpi_type_name: "Asistencia",
        current_value: item.current_value,
        unit: "PERCENTAGE",
        threshold_value: item.threshold_value,
        kpi_status_code: "AT_RISK",
        risk_level_code: "MEDIUM",
        period_start: item.period_start,
        period_end: item.period_end,
        measured_at: item.measured_at,
      }))));
      return;
    }
    if (path === "/reports/indicators" && req.method === "GET") {
      sendJson(res, 200, page([{
        kpi_status_code: "AT_RISK",
        risk_level_code: "MEDIUM",
        ficha_count: 1,
        avg_active_alert_count: 1,
        as_of: "2026-10-01T10:00:00Z",
      }]));
      return;
    }
    if (path === "/ficha-trackings" && req.method === "GET") {
      const fichaId = url.searchParams.get("ficha_id");
      const data = fichaId === null
        ? localFichaTrackings
        : localFichaTrackings.filter((item) => item.ficha_id === fichaId);
      sendJson(res, 200, page(data));
      return;
    }
    if (path.startsWith("/ficha-trackings/") && req.method === "GET") {
      const parts = path.split("/").map(decodeURIComponent);
      const trackingId = parts[2] ?? "";
      const tracking = localFichaTrackings.find((item) => item.id === trackingId);

      if (parts[3] === "tracking-sessions") {
        const sessions = localTrackingSessions.filter((item) => item.ficha_tracking_id === trackingId);
        sendJson(res, tracking ? 200 : 404, tracking ? page(sessions) : { error_code: "NOT_FOUND", message: "Seguimiento de ficha no encontrado" });
        return;
      }

      sendJson(res, tracking ? 200 : 404, tracking ?? { error_code: "NOT_FOUND", message: "Seguimiento de ficha no encontrado" });
      return;
    }
    if (path.match(/^\/ficha-trackings\/[^/]+\/tracking-sessions$/) && req.method === "POST") {
      sendJson(res, 201, { ...localTrackingSessions[0], id: `mock-session-${Date.now()}` });
      return;
    }
    if (path === "/generated-alerts" && req.method === "GET") {
      sendJson(res, 200, page(localGeneratedAlerts));
      return;
    }
    if (path.match(/^\/generated-alerts\/[^/]+\/resolve$/) && req.method === "PUT") {
      sendJson(res, 200, { ...localGeneratedAlerts[0], status: "RESOLVED", resolved_at: new Date().toISOString() });
      return;
    }
    if (path === "/improvement-plans" && req.method === "GET") {
      sendJson(res, 200, page(localImprovementPlans));
      return;
    }
    if (path === "/improvement-plans" && req.method === "POST") {
      sendJson(res, 201, { ...localImprovementPlans[0], id: `mock-plan-${Date.now()}` });
      return;
    }
    sendJson(res, 404, { error_code: "NOT_FOUND", message: `Ruta no encontrada: ${path}` });
  });
}
