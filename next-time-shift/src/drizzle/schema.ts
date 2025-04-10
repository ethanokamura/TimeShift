import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { DAYS_OF_WEEK } from "../data/constants";
import { relations } from "drizzle-orm";

// Universal Rows
const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date());

// Events Table
export const EventTable = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  // Duration of the scheduled event
  durationInMinutes: integer("durationInMinutes").notNull(),
  // Can change later if auth changes
  clerkUserId: text("clerkUserId").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  createdAt,
  updatedAt,
}, (t) => [
  // Index to do table look ups using the Clerk userId
  index("clerkUserIdIndex").on(t.clerkUserId),
]);

// Schedule Table
export const ScheduleTable = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  // We need the user's timezone to calculate correct availability
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt,
  updatedAt,
});

// Join Table for Schedules
export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable),
}))

// Allows for type safety using an enum
export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK);

// Availability Table
export const ScheduleAvailabilityTable = pgTable("scheduleAvailabilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Reference to schedule table
  scheduleId: uuid("scheduleId")
    .notNull()
    .references(() => ScheduleTable.id, { onDelete: "cascade" }),
  // Availability data
  startTime: text("startTime").notNull(),
  endTime: text("endTime").notNull(),
  dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
}, (t) => [
  // Index to do table look ups using the scheduleId
  index("scheduleIdIndex").on(t.scheduleId),
]);

// Relations table between availability and user's schedule
export const scheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({ one }) => ({
  schedule: one(ScheduleTable, {
    fields: [ScheduleAvailabilityTable.scheduleId],
    references: [ScheduleTable.id]
  }),
}));