import { NextResponse } from "next/server";import { mockLocations } from "@/lib/data/mock-locations";export function GET(){return NextResponse.json(mockLocations)}
