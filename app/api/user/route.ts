import {
  TUserInferInsert,
  userCreateUnique,
  userFindMany,
  userUpdateUnique,
} from "@/services/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await userFindMany();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as TUserInferInsert;

  try {
    const newUser = await userCreateUnique(body);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as TUserInferInsert & {
    id: number;
  };

  try {
    const updatedUser = await userUpdateUnique(body);

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
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
    );
  }
}
