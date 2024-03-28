import { prisma } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await prisma.questionSet.findMany());
}
