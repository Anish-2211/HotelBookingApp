import dbConfig from "@/lib/db.config";
import { NextResponse, NextRequest } from "next/server";
import Hotel from "@/models/hotel.model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConfig();
    const id = (await params)?.id;
    const body = await req.json();

    const hotel = await Hotel.findById(id);
    for (const k in body) {
      hotel[k] = body[k];
    }

    await hotel.save();

    return NextResponse.json(
      { Message: "Updated sucessfully!", data: hotel },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { Message: "Something went Wrong!", error: error },
      { status: 500 }
    );
  }
}
