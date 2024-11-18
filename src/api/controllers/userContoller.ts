import { Request, Response, NextFunction } from "express";
import { Prisma } from '@prisma/client'; // Import Prisma for error handling
import ApiError from '../utils/ApiError';
import HashPassword from "../utils/HashPassword";
import prisma from "../utils/Prisma";
import { setUser } from "../utils/Auth";
import bcrypt from 'bcrypt'
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
interface registerInfo {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userDetail: registerInfo = req.body;
        if (!userDetail.email || !userDetail.name || !userDetail.password) {
            throw new ApiError(400, 'All fields are required');
        }
        console.log("Got the user req body");
        const hashedPassword = await HashPassword(userDetail.password);
        console.log("Hashed the password ", hashedPassword);
        const user = await prisma.user.create({
            data: {
                name: userDetail.name,
                email: userDetail.email,
                password: hashedPassword 
            },
            select: {
                name: true,
                email: true
            }
        });

        if (!user) {
            throw new ApiError(500, "Database failed to save user details");
        }
        console.log("Create the user in db ",user);
        const obj = {
           email  : userDetail.email,
        }
        const token = setUser(obj)
        res.cookie("bearer",token,{
            httpOnly : false,
            secure : false,
            sameSite :'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.status(200).json({ message: "User registered successfully", user });

    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                message: error.message,
                statusCode: error.statusCode,
            });
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(500).json({
                message: "A database error occurred. Please try again later.",
                statusCode: 500,
            });
        } else if (error instanceof Error) {
            console.error("Error during user registration:", error);
            res.status(500).json({
                message: error.message || "Internal Server Error",
                statusCode: 500,
            });
        } else {
            res.status(500).json({
                message: "An unexpected error occurred. Please try again later.",
                statusCode: 500,
            });
        }
    }
};
interface LoginInfo {
    name: string;
    email: string;
    password: string;
}
export const loginUser = async(req:Request,res : Response):Promise<void> =>{
    try {
        const userDetail : LoginInfo = req.body
        if (!userDetail.email  || !userDetail.password) {
        throw new ApiError(400, 'All fields are required');
        }
        const user =await prisma.user.findUnique({
         where :{
          email : userDetail.email
         },
         select :{
          email : true,
          id : true,
          password:true
         } 
        })
        if (!user) {
         throw new ApiError(401, "Invalid credentials, please try again.");
        }
        const isPassword =  await bcrypt.compare(userDetail.password,user.password)
        if(!isPassword){
            throw new ApiError(401, "Invalid credentials, please try again.");
        }
        else{
            const obj =  {
              'email' : userDetail.email
            }
            const token =   setUser(obj);
            res.cookie("bearer",token,{
                httpOnly : false,
                secure : false,
                sameSite :'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ 
                message: "User login successfully", 
                data : {
                    id : user.id,
                    email : user.email
                }
             });
        }
    } catch (error) {
        if(error instanceof ApiError){
            res.status(error.statusCode).json({
                message : error.message,
                statusCode : error.statusCode
            })
        }
        else if(error instanceof PrismaClientInitializationError){
            res.status(500).json({
                message : "Database error occured please try again.",
                statusCode : 500
            })
        }
        else if(error instanceof Error){
            res.status(500).json({
                message : error.message || "Internet server error.",
                statusCode : 500
            })
        }else {
            res.status(500).json({
                message: "An unexpected error occurred. Please try again later.",
                statusCode: 500,
            });
        }
    }
    
}
export const logoutUser = (req : Request , res : Response):void=>{
    try {
        res.cookie('bearer',{
            httpOnly : true,
            secure : true,
            sameSite : 'strict',
            path : '/'
        }) 
    } catch (error) {
        throw new ApiError(500,"Logout failed")
    }
}