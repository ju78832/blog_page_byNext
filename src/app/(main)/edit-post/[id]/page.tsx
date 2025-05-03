"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPostById, updatePost } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud, Trash2 } from "lucide-react";
import { CldImage } from "next-cloudinary";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapped = React.use(params);
  const { id } = unwrapped;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const loadPost = async () => {
      const post = await getPostById(id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setFeatured(post.featured || false);
        setCurrentImageUrl(post.image || null);
      }
    };
    loadPost();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Clear current image URL when new file is selected
      setCurrentImageUrl(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setCurrentImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = currentImageUrl || "";

      // Upload new image if one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.publicId;
      }

      await updatePost(id, {
        title,
        content,
        excerpt,
        featured: session?.user.role === "ADMIN" ? featured : false,
        image: imageUrl,
      });

      toast.success("Post updated successfully!");
      router.push(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
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

          {/* Show current image if exists and no new file selected */}
          {currentImageUrl && !previewUrl && (
            <div className="relative group">
              <div className="relative h-64 w-full rounded-md overflow-hidden border">
                <CldImage
                  src={currentImageUrl}
                  alt="Current post image"
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeImage}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Upload area (shown if no image or when changing image) */}
          {(!currentImageUrl || previewUrl) && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
          )}

          {/* Preview of new image */}
          {previewUrl && (
            <div className="mt-4">
              <div className="relative h-48 w-full rounded-md overflow-hidden border">
                <CldImage
                  src={previewUrl}
                  fill
                  alt="New image preview"
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={removeImage}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
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
            {isLoading ? "Updating..." : "Update Post"}
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
