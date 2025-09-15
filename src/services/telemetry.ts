import AsyncStorage from '@react-native-async-storage/async-storage';

export type TelemetryEvent = {
  id: string;
  timestamp: number;
  event: string;
  props: Record<string, unknown>;
};

const STORAGE_KEY = 'melly.telemetry.v1';
const MAX_EVENTS = 1000; // Keep last 1000 events locally

function makeId() {
  return 'tel_' + Math.random().toString(36).slice(2, 10);
}

async function readEvents(): Promise<TelemetryEvent[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as TelemetryEvent[]; } catch { return []; }
}

async function writeEvents(events: TelemetryEvent[]) {
  // Keep only the most recent events
  const trimmed = events.slice(-MAX_EVENTS);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export async function trackEvent(event: string, props: Record<string, unknown> = {}) {
  const events = await readEvents();
  const newEvent: TelemetryEvent = {
    id: makeId(),
    timestamp: Date.now(),
    event,
    props,
  };
  events.push(newEvent);
  await writeEvents(events);
}

export async function getEvents(): Promise<TelemetryEvent[]> {
  return await readEvents();
}

export async function clearEvents() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function exportEvents(): Promise<string> {
  const events = await readEvents();
  return JSON.stringify(events, null, 2);
}
