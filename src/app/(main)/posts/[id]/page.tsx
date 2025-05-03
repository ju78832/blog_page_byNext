"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/generated/prisma";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapped = React.use(params);
  const { id } = unwrapped;
  const [post, setPost] = useState<Post | null>(null);
  useEffect(() => {
    const postOnPage = async () => {
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      console.log(data);
      setPost(data);
    };
    postOnPage();
  }, []);
  if (!post) return <div> Not Found</div>;

  return (
    <div className="container max-w-3xl py-8">
      <Card className="hover:bg-accent transition-colors">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{post.title}</CardTitle>
            <Link href="/">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
          <div className="relative h-48 w-48 mx-auto ">
            <CldImage
              src={post.image!}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {post.content}
          </div>
        </CardContent>
        <CardContent>
          <p className="line-clamp-3">{post.excerpt}</p>
        </CardContent>
      </Card>
    </div>
  );
}
