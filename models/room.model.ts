import mongoose, { Types } from "mongoose";

enum roomFacing {
  "North",
  "North-West",
  "North-East",
  "South",
  "South-West",
  "East",
  "West",
}

enum bedType {
  "twin",
  "Queen",
  "King",
}

interface IRoom {
  room_number: number;
  hotel: Types.ObjectId;
  amenity: Types.ObjectId;
  room_facing: roomFacing;
  description?: string;
  room_capacity: number;
  room_price: number;
  room_images?: string[];
  bed_type?: bedType;
  isSmoking?: boolean;
}

const hotelSchema = new mongoose.Schema<IRoom>(
  {
    room_number: {
      type: Number,
      required: true,
      minLength: 5,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    amenity: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],
    room_facing: String,
    description: {
      type: Number,
    },
    room_capacity: {
      type: Number,
      required: true,
    },
    room_price: { type: Number, required: true },
    room_images: String,
    bed_type: String,
    isSmoking: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
export default Hotel;
