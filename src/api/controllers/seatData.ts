import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import prisma from "../utils/Prisma";

interface TheaterDetail {
  id: number;
  movieName: string;
  showTime: string;
}

export default async function seatData(req: Request, res: Response) {
  try {
    const clientLastUpdate = new Date(
        typeof req.query.lastUpdated === 'string' || typeof req.query.lastUpdated === 'number' ? req.query.lastUpdated : 0
    );
    console.log(" clientLastUpdate " , clientLastUpdate);
    
    const theater: TheaterDetail = req.body;
    console.log(theater.movieName);
    
    if (!theater.id || !theater.movieName || !theater.showTime) {
      throw new ApiError(400, "Please send all required theater details.");
    }
    const movie = await prisma.movie.findUnique({
      where: { title: theater.movieName }
    });
    if (!movie) {
      throw new ApiError(404, "Movie not found");
    }
    const show = await prisma.showtime.findFirst({
      where: { movieId: movie.id, time: theater.showTime }
    });
    if (!show) {
      throw new ApiError(404, "Showtime not found");
    }
    const lastUpdated = await getLatestUpdateTime(theater.id, show.id);
    const checkForUpdates = async () => {
      const latestUpdateTime = await getLatestUpdateTime(theater.id, show.id);
    console.log("cheking for updates");
    
      if (latestUpdateTime && latestUpdateTime > clientLastUpdate) {
        console.log("I am in if case");
        
        const seats = await prisma.seat.findMany({
          where: {
            theaterId: theater.id,
            showtimeId: show.id
          },
          orderBy: { id: 'asc' }
        });

        if (!seats.length) {
          throw new ApiError(404, "Seats not found.");
        }
        res.status(200).json({ data: seats, lastUpdated: latestUpdateTime });

        console.log("i have send a response");
        
      } else {
        console.log("I am in else case set a time out of 1 sec" );
        setTimeout(checkForUpdates, 1000);
        console.log("done with timeOut");
        
      }
    };
    const timeout = setTimeout(() => {
        console.log(" I am in 25 sec timer");
        
      res.status(204).end(); 
    }, 25000);
    checkForUpdates();
    console.log(" done with seatData function");
    
    res.on("finish", () => clearTimeout(timeout));
  } catch (error) {
    handleError(res, error);
  }
}

async function getLatestUpdateTime(
  theaterId: number,
  showtimeId: number
): Promise<Date | null> {
  const result = await prisma.seat.findFirst({
    where: { theaterId, showtimeId },
    select: { updatedAt: true },
    orderBy: { updatedAt: 'desc' }
  });
  return result ? result.updatedAt : null;
}

function handleError(res: Response, error: unknown) {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode
    });
  } else if (error instanceof Error) {
    res.status(500).json({
      message: error.message,
      statusCode: 500
    });
  } else {
    res.status(500).json({
      message: "Unknown error occurred",
      statusCode: 500
    });
  }
}
