import dbConfig from "@/lib/db.config";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";
import Room from "@/models/room.model";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { JwtUserPayload } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    await dbConfig();
    const bookingData = await req.json();
    const headers = await req.headers;
    const usertoken = headers.get("Authorization") || "";
    const userDetails = (await jwt.verify(
      usertoken,
      process.env.JWT_SECRET_KEY || ""
    )) as JwtUserPayload;

    if (!userDetails) {
      return NextResponse.json(
        { Message: "Please login to book hotel!" },
        { status: 500 }
      );
    }

    const checkOutCalDate = new Date(bookingData.checkOutDate);
    const checkInCalDate = new Date(bookingData.checkInDate);

    if (checkOutCalDate <= checkInCalDate) {
      return NextResponse.json(
        { Message: "Checkout date must be grater than checkin date!" },
        { status: 500 }
      );
    }

    bookingData.user = userDetails?.userId;

    const room = await Room.findById(bookingData.room);

    bookingData.totalTarrif =
      (room.room_price *
        (checkOutCalDate.getTime() - checkInCalDate.getTime())) /
      (1000 * 60 * 60 * 24);

    const newBooking = await Booking.create(bookingData);

    const user = await User.findById(userDetails?.userId);

    user?.bookings
      ? user?.bookings.push(newBooking._id)
      : (user.bookings = [newBooking._id, newBooking._id]);
    user.save();

    // const bookingDetails = ;
    return NextResponse.json(
      { Message: "Room is booked sucessfully!", data: newBooking },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("ERROR : ", error);
    return NextResponse.json(
      { Message: "Something went Wrong!", error: error },
      { status: 500 }
    );
  }
}
