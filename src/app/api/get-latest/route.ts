import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const res = await prisma.post.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    if (!res) {
      return NextResponse.json({ message: "No posts found" }, { status: 201 });
    }
    return NextResponse.json({ data: res });
  } catch (error) {
    NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
