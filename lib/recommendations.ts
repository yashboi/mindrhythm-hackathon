import { RootCause } from "@/types/health";

export function generateRootCauseExplanation(rootCauses: RootCause[]) {
  return rootCauses.slice(0, 4);
}

export function generateActionPlan(rootCauses: RootCause[]) {
  const labels = new Set(rootCauses.slice(0, 5).map((cause) => cause.label));
  const actions: string[] = [];

  if (labels.has("Sleep duration")) actions.push("Move bedtime 45 minutes earlier tonight and protect that window like an appointment.");
  if (labels.has("Bedtime shift")) actions.push("Use one consistent wind-down cue tonight: dim lights, prep tomorrow, then screens down.");
  if (labels.has("Sleep efficiency")) actions.push("Keep the bedroom cool and avoid adding stimulating tasks in the last hour before bed.");
  if (labels.has("Stress")) actions.push("Choose one task to postpone, delegate, or simplify before the day ends.");
  if (labels.has("Mood")) actions.push("Send a short check-in message to someone you trust.");
  if (labels.has("Workload")) actions.push("Pick the one essential task for tomorrow and make the rest optional.");
  if (labels.has("Energy and connection")) actions.push("Schedule one low-pressure conversation or short walk.");

  return [...new Set(actions)].slice(0, 5);
}
