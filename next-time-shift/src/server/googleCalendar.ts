"use server"

import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis"
import { addMinutes, endOfDay, startOfDay } from "date-fns";
import "server-only"

export async function getCalendarEventTimes(
  clerkUserId: string, 
  { start, end }: { start: Date, end: Date}
) {
  const oAuthClient = await getOAuthClient(clerkUserId);

  const events = await google.calendar("v3").events.list({
    // Which calendar
    calendarId: "primary",
    // User created events (not holidays or general events)
    // eventTypes: ["default"],
    // Get all reoccuring events
    singleEvents: true,
    // Google prefered formatted start and end times
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    // Get all possible events
    maxResults: 2500,
    // Get specific user
    auth: oAuthClient,
  });

  return events.data.items?.map((event) => {
    // Check to see if the event takes up the entire day
    if (event.start?.date != null && event.end?.date != null) {
      return {
        start: startOfDay(event.start.date),
        end: endOfDay(event.end.date),
      }
    }

    // Check if there is a time
    if (event.start?.dateTime != null && event.end?.dateTime != null) {
      return {
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
      }
    }
  }).filter((date) => date != null) || []
}

export async function createCalendarEvent({
  clerkUserId,
  guestName,
  guestEmail,
  startTime,
  guestNotes,
  durationInMinutes,
  eventName,
}: {
  clerkUserId: string;
  guestName: string;
  guestEmail: string;
  startTime: Date;
  guestNotes: string | undefined;
  durationInMinutes: number;
  eventName: string;
}) {
  const oAuthClient = await getOAuthClient(clerkUserId);
  const calendarUser = await (await clerkClient()).users.getUser(clerkUserId);
  const emailAddress = calendarUser.primaryEmailAddress?.emailAddress;

  if (!emailAddress) {
    throw new Error('Clerk user has no email');
  }

  const fullName = calendarUser.fullName;

  try {
    const calendarEvent = await google.calendar('v3').events.insert({
      calendarId: 'primary',
      auth: oAuthClient,
      sendUpdates: 'all',
      requestBody: {
        attendees: [
          {
            email: guestEmail,
            displayName: guestName,
          },
          {
            email: emailAddress, // Now guaranteed to be a string
            displayName: fullName,
          },
        ],
        description: guestNotes ? `Additional Details: ${guestNotes}` : null,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: addMinutes(startTime, durationInMinutes).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        summary: `${guestName} + ${fullName}: ${eventName}`,
      },
    });

    return calendarEvent.data;
  } catch (error: any) {
    console.error('Error inserting calendar event:', error);
    throw error;
  }
}

async function getOAuthClient(clerkUserId: string) {

  // Get google Oauth token
  const token = await (await clerkClient()).users.getUserOauthAccessToken(clerkUserId, "google");

  console.log("Full Token Data:", token);
  console.log("Access token", token.data[0].token);

  // Ensure valid token
  if (token.data.length === 0 || token.data[0].token == null) {
    return;
  }

  // Our information
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );

  // User information
  client.setCredentials({ access_token: token.data[0].token });

  // Return user info
  return client;
}