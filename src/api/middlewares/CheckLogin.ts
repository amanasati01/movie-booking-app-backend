import { Request, Response, NextFunction } from "express";
import { getUser } from "../utils/Auth";
import ApiError from "../utils/ApiError";
import prisma from "../utils/Prisma";
import { JwtPayload } from "jsonwebtoken";
interface userPayload extends JwtPayload{
    email : string
}
export default async function CheckLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.bearer || req.header('Authorization')?.replace("bearer ","")
        if(!token){
          throw new ApiError(401,"Unauthorized request");
        }
        const decodedToken = getUser(token) as userPayload;
        if(decodedToken){
        const user =await prisma.user.findUnique({
          where :{
              email : decodedToken.email
          },
          select:{
            email : true,
            name : true
          }
        })
        if (!user) {
          throw new ApiError(401, "Unauthorized: User not found or invalid credentials");
        }
        (req as any).user = user
        next();
       }
        
    } catch (error) {
        if(error instanceof ApiError){
            res.status(error.statusCode).json({
                message : error.message,
                status : error.statusCode
            })
        }
        else if(error instanceof Error){
            res.status(500).json({
                message : error.message,
                status : 500
            })
        }
        else{
            res.status(500).json({
                message : "Unexpected error occured. please try again later",
                status : 500
            })
        }
    }
 
}
