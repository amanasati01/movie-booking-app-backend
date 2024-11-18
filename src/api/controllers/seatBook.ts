import { Request, Response } from "express";
import {seatBook} from '../utils/Seats'
import prisma from "../utils/Prisma";
import { log } from "console";

export default async function bookTicket(req: Request, res: Response) {
  try {
    const seatId = req.body;

    // Update seat booking
    const updatedSeat = await seatBook(seatId.id);

    // Fetch seat details with Promise.all
    const seatDetails = await Promise.all(
      seatId.id.map((id: number) =>
        prisma.seat.findUnique({
          where: { id },
          select: {
            number: true,
            seatType: true,
          },
        })
      )
    );
    
    const validSeatDetails = seatDetails.filter((seat) => seat !== null) as Array<{
      number: string;
      seatType: string;
    }>;

    // Add amount based on seatType
    const seatDetailsWithAmount = validSeatDetails.map((seat) => {
      let amount = 100; 
      if (seat.seatType === "boxA") amount = 2000;
      else if (seat.seatType === "boxF") amount = 150;

      return {
        ...seat,
        amount,
      };
    });

    
    const ticketData = seatDetailsWithAmount.map((seat) => ({
      movie: seatId.movie,
      theater: seatId.theater,
      buyerId: seatId.buyerId,
      startAt: seatId.startAt,
      seatType: seat.seatType,
      endAt: seatId.endAt,
      seatNo: seat.number,
      amount: seat.amount,
    }));

    await prisma.ticket.createMany({
      data: ticketData,
    });
    
    res.status(201).json({
      statusCode: 201,
      message: "Booking successful",
      updatedSeat,
    });
  } catch (error) {
   
    if (error instanceof Error) {
      res.status(500).json({
        statusCode: 500,
        message: error.message,
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Unexpected error occurred",
      });
    }
  }
}

