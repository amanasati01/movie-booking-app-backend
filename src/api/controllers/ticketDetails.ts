import { Request, response, Response } from "express";
import { accessSync } from "fs";
import ApiError from "../utils/ApiError";
import prisma from "../utils/Prisma";

export default async function ticketDetails(req:Request,res : Response){
    try {
        const {id} = req.query
        const userId = Number(id);
        if(!userId){
            throw new ApiError(400,"Id is required");
        }
        const response = await prisma.ticket.findMany({
            where :{
                buyerId : userId
            },
              
        })
        res.status(200).json({
            message : "Success",
            response
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