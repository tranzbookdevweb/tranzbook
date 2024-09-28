import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { ticketId, busId, userId, tripId, seatCode } = req.body;

    if (!ticketId || !busId || !userId || !tripId || !seatCode) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const ticket = await prisma.ticket.create({
        data: {
          ticketId,
          bus: { connect: { id: busId } }, 
        },
      });

      
      const booking = await prisma.booking.create({
        data: {
          user: { connect: { id: userId } }, 
          trip: { connect: { id: tripId } }, 
          ticket: { connect: { id: ticket.id } }, 
          seatCode,
        },
      });

      return res.status(201).json({ ticket, booking });
    } catch (error) {
      console.error('Error creating ticket and booking:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
