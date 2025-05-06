import dbConfig from "@/lib/db.config";
import { NextResponse, NextRequest } from "next/server";
import Room from "@/models/room.model";
import Hotel, { IHotel } from "@/models/hotel.model";
import Booking from "@/models/booking.model";

export async function POST(req: NextRequest) {
  try {
    await dbConfig();
    const room_details = await req.json();
    const isHotelAvailable = await Hotel.findOne({ _id: room_details.hotel });

    if (!isHotelAvailable) {
      return NextResponse.json(
        { Message: "Hotel not found!!" },
        { status: 500 }
      );
    }

    const isRoomAvailable = await Room.find({
      room_number: room_details.room_number,
    });
    if (isRoomAvailable.length) {
      return NextResponse.json(
        { Message: "Room number duplication!!" },
        { status: 500 }
      );
    }
    const room = await Room.create(room_details);
    isHotelAvailable.rooms.push(room._id);
    isHotelAvailable.save();

    return NextResponse.json(
      { Message: "Room is created sucessfully!", data: room },
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

export async function GET(
  req: NextRequest,
  {
    searchParams,
  }: {
    searchParams: {
      location: string;
      chechInDate: string;
      checkOutDate: string;
    };
  }
) {
  try {
    await dbConfig();

    const queries = req?.nextUrl?.searchParams;
    // console.log("QUERIRES : ", queries);
    const location = queries.get("location");
    const checkInDateStr = queries.get("checkInDate");
    const checkOutDateStr = queries.get("checkOutDate");

    if (!checkInDateStr || !checkOutDateStr) {
      throw new Error("Missing check-in or check-out date.");
    }

    const hotelsOnLocation: IHotel[] = await Hotel.find({
      location: location,
    }).populate("rooms");

    const roomsOnLocation = hotelsOnLocation
      .map((hotel) => hotel?.rooms)
      .flat();
    const allRoomsId = roomsOnLocation.map((r) => r?._id);

    const checkInDate = new Date(checkInDateStr);
    const checkOutDate = new Date(checkOutDateStr);
    const allFutureBookings = await Booking.find({
      room: { $in: allRoomsId },
      $or: [
        {
          checkInDate: { $lte: checkOutDate },
          checkOutDate: { $gte: checkInDate },
        },
      ],
    });

    // console.log("allFutureBookings : ", allFutureBookings);
    const uniqueRooms = new Map();
    roomsOnLocation.forEach((room) => uniqueRooms.set(room?.id, room));

    const availableRooms = roomsOnLocation?.filter(
      (room) => !allFutureBookings.includes(room?._id)
    );
    // const availableRooms = roomsOnLocation.filter(r => );

    return NextResponse.json(
      {
        Message: "All rooms fetched sucessfully!",
        data: { hotelsOnLocation, roomsOnLocation, availableRooms },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { Message: "Something went Wrong!", error: error },
      { status: 500 }
    );
  }
}
