import mongoose from "mongoose"

const dbConnect = ()=>{
  mongoose.connect(`${process.env.DB_URL}Brainly`).then(()=>{
    console.log("Connected Successfully")
  }).catch((err)=>{
    console.log("Something Went Wrong",err)
  })
}

export default dbConnect