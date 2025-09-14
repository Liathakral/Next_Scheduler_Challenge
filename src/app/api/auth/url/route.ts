import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role"); // seller or buyer

  if (!role) {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI // must match Google Cloud Console
  );

  const scopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",   // forces refresh token every time
  scope: scopes,
  state: `role=${role}`, // keep role tracking
});

  return NextResponse.json({ url });
}
