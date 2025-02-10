import { NextResponse } from "next/server";

export async function GET() {
  const repeatOptions = [
    { label: "Don't Repeat", value: "none" },
    { label: "Daily", value: "daily" },
    { label: "Specific Days", value: "specific" },
  ];
  return NextResponse.json(repeatOptions);
}
