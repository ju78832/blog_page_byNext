"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Post } from "@/generated/prisma";
import {
  deletePost,
  getPosts,
  checkAdmin,
  toggleFeatured,
} from "@/lib/actions";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const respones = async () => {
      await checkAdmin();
      setPosts(await getPosts());
    };
    respones();
  }, []);

  const deletePostHandler = async (id: string) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Posts</h1>
        <Link href="/create-post">
          <Button>Create Post</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Featured</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.authorId}</TableCell>
              <TableCell className="flex gap-2">
                <Link href={`/edit-post/${post.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <form>
                  <input type="hidden" name="id" value={post.id} />
                  <Button
                    onClick={() => deletePostHandler(post.id)}
                    variant="destructive"
                    size="sm"
                    type="submit"
                  >
                    Delete
                  </Button>
                </form>
              </TableCell>
              <TableCell>
                <Button
                  variant={post.featured ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeatured(post.id)}
                >
                  {post.featured ? "Featured" : "Make Featured"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
