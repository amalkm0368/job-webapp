import mongoose from "mongoose"

export const connectDb = async () => {
  const connect = await mongoose.connect(process.env.MONGODB_URL)
  console.log(`db connect with ${connect.connection.host}`)
}
