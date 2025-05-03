import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const featuredPost = await prisma.post.findFirst({
      where: { featured: true },
      include: { author: { select: { name: true } } },
    });
    if (!featuredPost) {
      return NextResponse.json({ message: "No posts found" }, { status: 201 });
    }
    return NextResponse.json({ data: featuredPost });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
