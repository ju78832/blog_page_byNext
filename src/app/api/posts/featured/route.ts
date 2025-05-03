import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const featuredPost = await prisma.post.findFirst({
    where: { featured: true },
    include: { author: { select: { name: true } } },
  });
  return NextResponse.json(featuredPost);
}

export async function POST(req: Request) {
  const { postId } = await req.json();
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.post.updateMany({
    where: { featured: true },
    data: { featured: false },
  });

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { featured: true },
  });

  return NextResponse.json(updatedPost);
}
