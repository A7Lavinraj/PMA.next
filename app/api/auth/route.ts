import { db } from "@/database";
import { users } from "@/database/schema";
import { hash, compare } from "bcrypt";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const SALT_ROUNDS = 12;
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function signToken(user: { id: number; role: string }) {
  return await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id.toString())
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, body.email),
    });

    let user = existingUser;

    if (existingUser) {
      const isPasswordCorrect = await compare(
        body.password,
        existingUser.password,
      );

      if (!isPasswordCorrect) {
        return NextResponse.json(
          { success: false, error: "Password not correct" },
          { status: 401 },
        );
      }
    } else {
      const [createdUser] = await db
        .insert(users)
        .values({
          ...body,
          password: await hash(body.password, SALT_ROUNDS),
        })
        .returning();

      user = createdUser;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Auth failed" },
        { status: 401 },
      );
    }

    const token = await signToken({
      id: user.id,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        role: user.role,
      },
    });

    res.cookies.set("__token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
