"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useEffect, useState } from "react";
import { Post } from "@/generated/prisma";

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getLatestPost = async () => {
      const response = await fetch("/api/get-latest");
      const data = await response.json();
      console.log(data.data);
      setLatestPosts(data.data);
      if (!response.ok) {
        throw new Error("Failed to fetch latest posts");
      }
    };
    const getFeaturedPosts = async () => {
      const response = await fetch("/api/get-featured");
      const data = await response.json();
      console.log(data);
      setFeaturedPosts(data.data ? [data.data] : []);
      if (!response.ok) {
        throw new Error();
      }
    };
    getLatestPost();
    getFeaturedPosts();
  }, []);

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="max-w-full mx-auto">
        <div className="relative min-h-screen overflow-hidden">
          <BackgroundBeamsWithCollision>
            <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
              Welcome! Spot your word here{" "}
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span className="">Blogspot.</span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                  <span className="">Blogspot.</span>
                </div>
                <Button asChild size="lg">
                  <Link href="/posts">Explore Posts</Link>
                </Button>
              </div>
            </h2>
          </BackgroundBeamsWithCollision>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Post</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="relative h-48">
                  <CldImage
                    src={post.image!}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="text-2xl font-bold">{post.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={`/posts/${post.id}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts &&
            latestPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="relative h-48 w-48 mx-auto">
                  <CldImage
                    src={post.image!}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="text-xl font-bold">{post.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0">
                    <Link href={`/posts/${post.id}`}>Read More →</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mt-16 bg-secondary rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-6">
            Get the latest posts delivered right to your inbox
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-1"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
