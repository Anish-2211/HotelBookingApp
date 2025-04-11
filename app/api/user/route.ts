import dbConfig from "@/lib/db.config";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: any) {
  try {
    await dbConfig();
    const user_details = await req.json();
    const user = await User.create(user_details);
    return NextResponse.json(
      { Message: "User is created sucessfully!", data: user },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { Message: "Something went Wrong!", error: error },
      { status: 500 }
    );
  }
}
