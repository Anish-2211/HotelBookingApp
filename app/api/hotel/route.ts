import dbConfig from "@/lib/db.config";
import { NextResponse, NextRequest } from "next/server";
import Hotel from "@/models/hotel.model";

export async function POST(req: NextRequest) {
  try {
    await dbConfig();
    const hotel_details = await req.json();
    // console.log(hotel_details);
    const hotel = await Hotel.create(hotel_details);
    return NextResponse.json(
      { Message: "Hotel is created sucessfully!", data: hotel },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { Message: "Something went Wrong!", error: error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConfig();
    const hotel = await Hotel.find({});
    return NextResponse.json(
      { Message: "All Hotels fetched sucessfully!", data: hotel },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { Message: "Something went Wrong!", error: error },
      { status: 500 }
    );
  }
}
