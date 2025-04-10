export interface Event {
  id: string,
  isActive: boolean,
  name: string,
  description: string | null,
  durationInMinutes: number,
  clerkUserId: string,
}

export type EventProps = {
  id: string,
  isActive: boolean,
  name: string,
  description: string | null,
  durationInMinutes: number,
  clerkUserId: string,
}

export type PublicEventProps = {
  id: string,
  name: string,
  description: string | null,
  durationInMinutes: number,
  clerkUserId: string,
}