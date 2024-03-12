import mongoose from "mongoose";
const connectedDB = async() => {
    try {
      const connectedString = await mongoose.connect(process.env.MONGODB_URI_CONNNECTIONSTRING as string);
      console.log(`MongoDB is connected successfully on: ${connectedString.connection.host}`);
    } catch(error: string | any) {
     console.error(`Error ${error.message}`);
    }
}
export default connectedDB;