import { response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user from the payload 
    const { fullName, email, username, password } = req.body
    console.log(fullName, email);

    //validation - not empty

    // if (fullName==="") {
    //     throw apiError(400,"fullname is required")
    // }
    //  if(email === ""){
    //     throw apiError(400,"email is required")
    // }
    //  if(username=""){
    //     throw apiError(400,"email is required")
    // }
    // if(password=""){
    //     throw apiError(400,"password is required")
    // }


    // alternative of above code 
    //Ittirating with some array method and checking if null is present
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")
    }
    if (!email.includes('@')) {
        throw new apiError(400, "@ is neccessary")
    }




    //check user is already exist or not 
    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new apiError(409, "User with email or username already exists")
    }


    //check for images , check for avtar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new apiError(400,"Avatar is required")
    }

    //upload them to cloudinary , avtar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new apiError(400,"Uploading error for Avatar")
    }


    //create user object - Create entry in DB

    const user = await User.create({
        fullName ,
        avatar: avatar.url ,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    
    //remove password and refresh field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //Check for user creation
    if(!createdUser){
        throw new apiError(500, "Something went wrong while registration")
    }

    //return response
    return res.status(201).json(
        new apiResponse(200, createdUser , "User created successfully")
    )
})


export { registerUser }