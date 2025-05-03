import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const prisma = new PrismaClient();

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const setTime = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        verifyCode: code,
        verifyCodeExpiry: setTime,
      },
    });
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      react: await EmailTemplate({ code, email }),
    });
    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 400 }
      );
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 400 });
    }
    const user = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
