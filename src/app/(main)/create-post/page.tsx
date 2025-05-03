"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud } from "lucide-react";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "blog_uploads"); // Replace with your Cloudinary upload preset

        const uploadResponse = await fetch(
          "/api/image-upload", // Replace with your Cloudinary cloud name
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.publicId;
      }

      // Then create the post with the image URL
      await createPost({
        title,
        content,
        excerpt,
        featured: session?.user.role === "ADMIN" ? featured : false,
        image: imageUrl,
      });

      toast.success("Post created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {session?.user.role === "ADMIN" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={() => setFeatured(!featured)}
            />
            <Label htmlFor="featured">Feature this post</Label>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt (short description)</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={160}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Featured Image</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, or WEBP (MAX. 5MB)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <div className="relative h-48 w-full rounded-md overflow-hidden border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
