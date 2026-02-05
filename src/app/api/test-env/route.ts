import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        GMAIL_USER: process.env.GMAIL_USER ? "DEFINED" : "UNDEFINED",
        GMAIL_PASS: process.env.GMAIL_PASS ? "DEFINED" : "UNDEFINED",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "DEFINED" : "UNDEFINED",
        NODE_ENV: process.env.NODE_ENV,
    });
}
