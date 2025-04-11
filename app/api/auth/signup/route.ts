import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';


import dbConfig from '@/lib/db.config';
import User from '@/models/user.model';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log(name, email,password)

    if (!name || !email || !password) {
        return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }
    
    await dbConfig();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log("hello im here")
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('[SIGNUP_ERROR]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
