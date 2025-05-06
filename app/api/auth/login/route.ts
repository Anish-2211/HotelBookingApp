import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "@/models/user.model";
import dbConfig from "@/lib/db.config";
import { JwtUserPayload } from "@/types/user";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }

    await dbConfig();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const SECRET = process.env.JWT_SECRET_KEY || "";

    const payload: JwtUserPayload = { userId: user._id, email: user.email };
    const token = await jwt.sign(payload, SECRET, { expiresIn: "7d" });

    (await cookies()).set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      //   secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
    });

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
