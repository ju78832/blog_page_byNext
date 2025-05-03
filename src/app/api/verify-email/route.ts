import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.verifyCode !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }
    if (
      user.verifyCodeExpiry &&
      user.verifyCodeExpiry?.getTime() < new Date().getTime()
    ) {
      return NextResponse.json(
        { error: "Verification code expired" },
        { status: 400 }
      );
    }
    await prisma.user.update({
      where: { email },
      data: { verified: true, verifyCode: null, verifyCodeExpiry: null },
    });
    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
