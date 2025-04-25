import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import dbConfig from "@/lib/db.config";
import User from "@/models/user.model";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    // console.log(name, email,password)

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await dbConfig();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
