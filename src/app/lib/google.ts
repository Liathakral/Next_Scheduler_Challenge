// src/lib/google.ts
import { google } from "googleapis";
import { decrypt } from "./crypto";

const SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthUrl(role?: "seller" | "buyer") {
  const o = getOAuthClient();
  return o.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: role ?? "buyer",
  });
}

export async function getTokensFromCode(code: string) {
  const o = getOAuthClient();
  const { tokens } = await o.getToken(code);
  return tokens;
}

export function getCalendarFromEncryptedToken(enc: string) {
  const refresh_token = decrypt(enc);
  const o = getOAuthClient();
  o.setCredentials({ refresh_token });
  const calendar = google.calendar({ version: "v3", auth: o });
  return { oauth2Client: o, calendar };
}
