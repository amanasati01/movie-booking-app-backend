import { Request, Response } from "express"
import createTheater from "../utils/CreateTheater"
import generateSeats from "../utils/GenerateSeats"
import ApiError from "../utils/ApiError"
  interface theaterDetailsTypes {
    name: string, 
    location: string,
    showTime : string,
    movieName : string
  }
export default async function theaterGenerations(req:Request,res : Response) {
  try {
         const theaterDetails : theaterDetailsTypes = req.body
         console.log(theaterDetails);
         
         if(!theaterDetails.location ||!theaterDetails.movieName || !theaterDetails.name || !theaterDetails.showTime ){
          throw new ApiError(400,'Send complete info of theater')
         }
        const theater =await createTheater(theaterDetails.name,theaterDetails.location,theaterDetails.showTime,theaterDetails.movieName)
        res.status(201).json({theater,
          "statusCode" : 201
        })
  } catch (error) {
    if(error instanceof ApiError){
      res.status(error.statusCode).json({
        message : error.message,
        statusCode : error.statusCode
      })
    }
    else if(error instanceof Error){
      res.status(500).json({
        message : error.message,
        statusCode : 500
      })
    }
    else{
      res.status(500).json({
        messsage : 'An unexpected error occured',
        statusCode : 500,
    })
    }
      
  }
}
