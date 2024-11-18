import prisma from "./Prisma";
enum SeatStatus {
    AVAILABLE = 'AVAILABLE',
    BLOCKED = 'BLOCKED',
    BOOKED = 'BOOKED',
    SELECTED = 'SELECTED'
}
async function updateSeatStatus(seatIds: number[], newStatus: SeatStatus) {
    const updatedSeats = await prisma.$transaction(async (prisma) => {
        const updatedResults = [];
        for (const id of seatIds) {
            const seat = await prisma.seat.findUnique({ where: { id } });
            if (!seat) {
                throw new Error(`Seat with id ${id} not found.`);
            }
            
            const updatedSeat = await prisma.seat.update({
                where: { id },
                data: { status: newStatus },
            });
            updatedResults.push(updatedSeat);
        }
        return updatedResults;
    });
    return updatedSeats;
}

export async function seatBook(seatId: number[]) {
    return updateSeatStatus(seatId, SeatStatus.BOOKED);
}
export async function seatBlock(seatId: number[]) {
    return updateSeatStatus(seatId, SeatStatus.BOOKED);
}
export async function seatAvailable(seatId: number) {
    const updatedSeats = await prisma.$transaction(async (prisma) => {
        let updatedResults: any
        
            const seat = await prisma.seat.findUnique({ where: { id : seatId } });
            if (!seat) {
                throw new Error(`Seat with id ${seatId} not found.`);
            }
            if (seat.status === "AVAILABLE") {
                console.log("Error occured");
                throw new Error(`Seat with id ${seatId} is already ${SeatStatus.AVAILABLE}.`);
            }
            const updatedSeat = await prisma.seat.update({
                where: { id : seatId },
                data: { status: SeatStatus.AVAILABLE },
            });
            updatedResults = updatedSeat;
    
        return updatedResults;
    });
}
// export async function seatSelected(seatId: number[]) {
//     return updateSeatStatus(seatId, SeatStatus.SELECTED);
// }
