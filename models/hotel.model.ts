import mongoose, { Types } from "mongoose";

export interface IHotel {
  hotel_name: string;
  hotel_full_address?: { type: String };
  hotel_contactNo: number;
  ratings?: string;
  description?: string;
  location: string;
  amenties?: Types.ObjectId;
  hotel_image?: string;
  rooms?: Types.ObjectId[];
}

const hotelSchema = new mongoose.Schema<IHotel>(
  {
    hotel_name: { type: String, required: true },
    hotel_full_address: { type: String },
    hotel_contactNo: {
      type: Number,
      required: true,
      unique: true,
      pattern: [
        "^(+91[-s]?)?[0]?(91)?[789]d{9}$",
        "Please put your valid Phone number",
      ],
    },
    ratings: { type: String },
    description: { type: String },
    location: { type: String, required: true },
    amenties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],
    hotel_image: [
      {
        type: String,
        ref: "Image",
      },
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  { timestamps: true }
);

const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
export default Hotel;
