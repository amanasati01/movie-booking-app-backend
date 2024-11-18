import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import prisma from "../utils/Prisma";

export default async function userDetails(req: Request,res:Response): Promise<void>{
   try {
    let  {id} = req.query
    const userId  =  Number(id)
    if(!userId){
     throw new ApiError(400,'User id is required');
    }
    const response = await prisma.user.findUnique({
        where : {
            id : userId
        },
        select :{
            email : true,
            name : true
        }
    })
    if(!response){
        throw new ApiError(400,"cannot find user on this id");
    }
    res.status(200).json({
       message : "Successfull",
       email : response.email,
       name : response.name
    })
   } catch (error) {
      if(error instanceof ApiError){
        res.status(error.statusCode).json({
            message : "Failed",
            error : error.message
        })
      }
      else if(error instanceof Error){
        res.status(500).json({
            message : "Failed",
            error : error.message
        })
      }
      else{
        res.status(500).json({
            message : "Failed",
            error  : "Internal server error"
        })
      }
   }
}