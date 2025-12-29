import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await db.query.users.findMany();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const [newUser] = await db.insert(users).values(body).returning();

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  try {
    const [updatedUser] = await db
      .update(users)
      .set(body)
      .where(eq(users.id, body.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
    );
  }
}
