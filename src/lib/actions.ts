"use server";
import { PrismaClient } from "@/generated/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
export async function getPosts() {
  return await prisma.post.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}
export async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function deletePost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;

  // Verify the user is the author or an admin
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  if (post.authorId !== session.user._id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/posts");
}

export async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/denied");
  }
}

// Additional functions to add to lib/actions.ts
export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPost({
  title,
  content,
  excerpt,
  featured,
  image,
}: {
  title: string;
  excerpt: string;
  content: string;
  featured: boolean;
  image: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: session.user._id?.toString()!,
      excerpt,
      featured,
      image,
    },
  });

  revalidatePath("/");
  return post;
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    content: string;
    excerpt?: string;
    featured?: boolean;
    image?: string;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) throw new Error("Post not found");

  if (
    existingPost.authorId !== session.user._id &&
    session.user.role !== "ADMIN"
  ) {
    throw new Error("Unauthorized");
  }

  return await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      featured:
        session.user.role === "ADMIN" ? data.featured : existingPost.featured,
      image: data.image,
    },
  });
}

export async function getFeaturedPosts() {
  return await prisma.post.findFirst({
    where: { featured: true },
    include: { author: { select: { name: true } } },
  });
}

export async function getLatestPosts() {
  return await prisma.post.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}

export async function toggleFeatured(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  return await prisma.post.update({
    where: { id: postId },
    data: { featured: !post.featured },
  });
}
