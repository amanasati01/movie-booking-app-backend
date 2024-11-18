import { Request, Response } from "express";
import {seatAvailable, seatBlock} from '../utils/Seats'
import { log } from "console";

export default async function blockTheSeat(req:Request,res : Response) {
        try {
            console.log("Request have reached at block seat route");
            const seatId = req.body
            console.log("seat id arr -> ",seatId.id);
            setTimeout(() => {
                async function makeAvailable() {
                  try {
                    
                    const results = await Promise.all(
                      seatId.id.map(async (ele: number) => {
                        const done = await seatAvailable(ele);
                        console.log("done ->", done);
                        return done; 
                      })
                    );
                    console.log("All done:", results);
                  } catch (error) {
                    console.error("Error making seats available:", error);
                  }
                }
                makeAvailable();
              }, 10000);
            const updatedSeat =await seatBlock(seatId.id)

            res.status(201).json({
                statusCode : 201,
                message : "successfull",
                updatedSeat,
            })
        } catch (error) {
            if(error instanceof Error){
                res.status(500).json({
                    satusCoce : 500,
                    messsage : error.message
                })
            }else{
                res.status(500).json({
                    satusCode : 500,
                    messsage : "Unexpected error occured"
                })
            }
        }
}