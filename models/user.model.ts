// import { timeStamp } from "console";
// import { unique } from "next/dist/build/utils";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {hash} = require('bcrypt');


const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
      age: Number,
      email: {
          type:String,
          unique:true,
          required:true
      },
      password: {
        type: String,
        required: true,
        //   select: false, // hide password in response
      },
    },
    {
      timestamps: true,
    }
  );
  
  userSchema.pre("save", async function (next:any) {
    try{
    // hash the password before saving it to the database
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } else{
        next();
    }
  } catch (err){
    console.log(err,"error in password encryption")
    return;
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;















// // models/User.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
// }

// const UserSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
