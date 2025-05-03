import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { arrayBuffer } from "stream/consumers";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get("file") as File) || null;
    if (!file) {
      return NextResponse.json(
        { message: "File is not there" },
        { status: 405 }
      );
    }
    const byte = await file.arrayBuffer();
    const buffer = Buffer.from(byte);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "image-optimize" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(buffer);
      }
    );
    return NextResponse.json(
      {
        publicId: result.public_id,
        message: "Image uploaded successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
