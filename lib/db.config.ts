import mongoose from "mongoose"
const mongo_db_uri = process.env.MONGODB_URL;

if(!mongo_db_uri){
    throw new Error("please connect to database")
}

export default async function dbConfig(){
    if(mongoose.connection.readyState >=1){
        // console.log("Already connected to monodb")
        return;
    }
    try{
        await mongoose.connect(mongo_db_uri);
        console.log("MongoDb connected successfully")
    }
    catch(error){
        console.log(error)
        throw new Error("Failed to connect")
    }
}