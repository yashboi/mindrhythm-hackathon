import { NextResponse } from "next/server";import { mockSources } from "@/lib/data/mock-sources";export function GET(){return NextResponse.json(mockSources)}
