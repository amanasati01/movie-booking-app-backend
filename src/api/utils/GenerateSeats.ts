import { error } from "console";
import prisma from "./Prisma";
import ApiError from "./ApiError";
interface seatType{
    number : string,
    theaterId : number,
    seatType : string,
    showtimeId : number
} 
export default async function generateSeats(theaterId : number,showtimeId:number){
     //BoxA
    const boxA :seatType[] = [];
    const seat = await prisma.seat.findFirst({
        where:{
            showtimeId,
            theaterId
        }
    })
    if(!seat){
    for(let col = 1;col<=12;col++){
        boxA.push({
            number : String(col),
            theaterId ,
            seatType : 'boxA',
            showtimeId
        })
    }
    await prisma.seat.createMany({
        data : boxA
    })
    //BoxF
     const boxF :seatType[] = [];
     for(let col = 1;col<=18;col++){
         boxF.push({
             number : String(col),
             theaterId ,
             seatType : 'boxF',
             showtimeId
         })
     }
     await prisma.seat.createMany({
         data : boxF
     })
    //Balcony Gold
    const gold :seatType[] =[]
    for (let row = 1; row <= 5; row++) {
        const rowLabel = String.fromCharCode(64 + row); 
        for (let seat = 1; seat <= 15; seat++) {
            gold.push({
            number: `${rowLabel}${seat}`,  
            theaterId: theaterId,
            showtimeId,
            seatType : 'gold'
          });
        }
    }
    await prisma.seat.createMany({
        data:gold
    }) 
    //Deluxe
    // const deluxe :seatType[] =[]
    // for (let row = 1; row <= 5; row++) {
    //     const rowLabel = String.fromCharCode(64 + row); 
    //     for (let seat = 1; seat <= 15; seat++) {
    //         deluxe.push({
    //         number: `${rowLabel}${seat}`,  
    //         theaterId: theaterId,
    //         showtimeId,
    //         seatType : 'gold'
    //       });
    //     }
    // }
    // await prisma.seat.createMany({
    //     data:deluxe
    // })}
}
    else{
        return;
    }
}
