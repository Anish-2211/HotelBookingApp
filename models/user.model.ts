// import { timeStamp } from "console";
// import { unique } from "next/dist/build/utils";
import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  name: string;
  age?: number;
  email: string;
  password: string;
  bookings?: Types.ObjectId[];
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    age: Number,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      //   select: false, // hide password in response
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next: any) {
  try {
    // hash the password before saving it to the database
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } else {
      next();
    }
  } catch (err) {
    console.log(err, "error in password encryption");
    return;
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
