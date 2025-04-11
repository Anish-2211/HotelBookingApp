// checkInDate, checkOutDate , location
import mongoose, { Types } from "mongoose";

enum categoryEnum {
  room = "room",
  hotel = "hotel",
  common = "common",
}

interface IAmenity {
  name: string;
  category?: categoryEnum;
  description: string;
  hotel: Types.ObjectId;
  room?: Types.ObjectId;
}

const amenitySchema = new mongoose.Schema<IAmenity>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: categoryEnum.common,
    },
    description: {
      type: String,
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: true }
);

const Amenities =
  mongoose.models.Amenities || mongoose.model("Amenities", amenitySchema);
export default Amenities;
