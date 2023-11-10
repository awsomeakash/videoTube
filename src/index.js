import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path: '../env'
})

const port = process.env.PORT || 8000
connectDB()
.then(()=>{
    app.listen(port , ()=>{
        console.log(`Server is running at port : ${port}`)
    })
    app.on("errror", (error) => {
        console.log("ERRR: ", error);
        throw error
    })
})
.catch((err)=>{
    console.log(`MONGO DB Connection Fail !!`,err)
})



/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/