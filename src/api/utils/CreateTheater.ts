import generateSeats from "./GenerateSeats";
import prisma from "./Prisma";

const createTheater = async (name: string, location: string, showtime: string, movieName: string) => {
  
  let theater = await prisma.theater.findUnique({
    where: {
      name: name,
    },
  });

  if (!theater) {
    theater = await prisma.theater.create({
      data: {
        name: name,
        location: location,
      },
    });
  }

  
  let movie = await prisma.movie.findUnique({
    where: {
      title: movieName,
    },
  });

  if (!movie) {
    movie = await prisma.movie.create({
      data: {
        title: movieName,
        duration: 3, 
      },
    });
  }

  
  let show = await prisma.showtime.findFirst({
    where: {
      time: showtime,
      movieId: movie.id, 
    },
  });

 
  if (!show) {
    show = await prisma.showtime.create({
      data: {
        time: showtime,
        movieId: movie.id,
      },
    });
  }

  
  if (theater && show) {
    await generateSeats(theater.id, show.id);
  }
  return theater;
};

export default createTheater;
