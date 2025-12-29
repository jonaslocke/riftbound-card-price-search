"use client";

import {
  AnalyticsEventSchema,
  type AnalyticsEvent,
  type AnalyticsEventName,
} from "./analytics/schema";

const ANALYTICS_ENDPOINT = "/api/analytics";

const FLOW_ID_KEY = "analytics_flow_id";
const SESSION_ID_KEY = "analytics_session_id";
const ANON_ID_KEY = "analytics_anonymous_id";

let memoryFlowId: string | null = null;
let memorySessionId: string | null = null;
let memoryAnonymousId: string | null = null;

function getStorage(type: "local" | "session"): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return type === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function getOrCreateId(
  key: string,
  storage: Storage | null,
  memory: string | null
) {
  if (storage) {
    const existing = storage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    storage.setItem(key, created);
    return created;
  }
  return memory ?? crypto.randomUUID();
}

export function getOrCreateFlowId() {
  const storage = getStorage("session");
  const value = getOrCreateId(FLOW_ID_KEY, storage, memoryFlowId);
  memoryFlowId = value;
  return value;
}

export function resetFlowId() {
  const storage = getStorage("session");
  const created = crypto.randomUUID();
  if (storage) storage.setItem(FLOW_ID_KEY, created);
  memoryFlowId = created;
  return created;
}

export function getOrCreateSessionId() {
  const storage = getStorage("session");
  const value = getOrCreateId(SESSION_ID_KEY, storage, memorySessionId);
  memorySessionId = value;
  return value;
}

export function getOrCreateAnonymousId() {
  const storage = getStorage("local");
  const value = getOrCreateId(ANON_ID_KEY, storage, memoryAnonymousId);
  memoryAnonymousId = value;
  return value;
}

function detectDeviceType(): "desktop" | "mobile" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth || 0;
  if (width <= 767) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}

function getEnv(): AnalyticsEvent["env"] {
  const raw =
    process.env.NEXT_PUBLIC_ENV ?? process.env.NODE_ENV ?? "development";
  if (raw === "production") return "prod";
  if (raw === "development") return "dev";
  return raw as AnalyticsEvent["env"];
}

type EventOverrides = Partial<
  Pick<
    AnalyticsEvent,
    | "flow_id"
    | "session_id"
    | "anonymous_id"
    | "user_id"
    | "page_url"
    | "referrer"
    | "device_type"
    | "env"
    | "app_version"
  >
>;

type AnalyticsEventPayloadMap = {
  [K in AnalyticsEventName]: Extract<
    AnalyticsEvent,
    { event_name: K }
  >["payload"];
};

export function buildEvent<K extends AnalyticsEventName>(
  event_name: K,
  payload: AnalyticsEventPayloadMap[K],
  overrides?: EventOverrides
): Extract<AnalyticsEvent, { event_name: K }> {
  const pageUrl =
    overrides?.page_url ??
    (typeof window !== "undefined" ? window.location.href : "");
  const referrer =
    overrides?.referrer ??
    (typeof document !== "undefined" ? document.referrer || null : null);

  return {
    event_name,
    event_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    flow_id: overrides?.flow_id ?? getOrCreateFlowId(),
    session_id: overrides?.session_id ?? getOrCreateSessionId(),
    anonymous_id: overrides?.anonymous_id ?? getOrCreateAnonymousId(),
    user_id: overrides?.user_id ?? null,
    page_url: pageUrl,
    referrer,
    device_type: overrides?.device_type ?? detectDeviceType(),
    env: overrides?.env ?? getEnv(),
    app_version:
      overrides?.app_version ?? process.env.NEXT_PUBLIC_APP_VERSION ?? null,
    payload,
  } as Extract<AnalyticsEvent, { event_name: K }>;
}

export function trackEvent<K extends AnalyticsEventName>(
  event_name: K,
  payload: AnalyticsEventPayloadMap[K],
  overrides?: EventOverrides
): boolean {
  const event = buildEvent(event_name, payload, overrides);
  const parsed = AnalyticsEventSchema.safeParse(event);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("Invalid analytics event", parsed.error.format());
    }
    return false;
  }
  const body = JSON.stringify(parsed.data);
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const ok = navigator.sendBeacon(
      ANALYTICS_ENDPOINT,
      new Blob([body], { type: "application/json" })
    );
    if (ok) return true;
  }
  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "include",
  }).catch(() => undefined);
  return false;
}
