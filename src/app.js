import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
})) // Connect backend to frontend

app.use(express.json({limit:"16kb"})) //For using form data
app.use(express.urlencoded({extended:true , limit:"16kb"})) // Using url params into the code 
app.use(express.static("public")) //To access a folder where you want some data to be stored locally
app.use(cookieParser()) // To read and edit the cookies in the client side


export {app}
