"use client";
import React, { useState } from "react";
import Barcode from "react-barcode";
import { Button } from "@/components/ui/button";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import { useMediaQuery } from "react-responsive";
import { CircularProgress } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface TicketProps {
  ticketId: string | string[];
  busNumber: string | number;
  busCompany: string;
  busModel: string;
  busRoute: { origin: string; destination: string };
  tripDuration: string | number;
  tripDepartureTime: number | string;
  tripArrivalTime: number | string;
  busFare: number;
  currency: string;
  totalCost: number;
  currentDate: Date;
  selectedSeats: string[];
  isBooked: boolean;
}

const Ticket: React.FC<TicketProps> = ({
  ticketId,
  totalCost,
  busNumber,
  busCompany,
  busModel,
  busRoute,
  tripDuration,
  tripDepartureTime,
  tripArrivalTime,
  busFare,
  currency,
  currentDate,
  selectedSeats,
  isBooked,
}) => {
  const options = {
    method: "open",
    resolution: 2,
    format: "letter",
    orientation: "landscape",
  };
  const [isClicked, setClicked] = useState(false);
  
  const handleDownloadTicket = () => {
    // setClicked(true);
    try {
      generatePDF(getTargetElement, {
        method: "open",
        resolution: Resolution.HIGH,
        page: {
          margin: Margin.NONE,
          format: "letter",
          orientation: "l",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      // setClicked(false);
    }
  };

  const getTargetElement = () => document.getElementById("ticket");
  const isTablet = useMediaQuery({ minWidth: 768 });
  const isPhone = useMediaQuery({ maxWidth: 648 });

  return (
    <div className='flex flex-col justify-start min-h-full max-sm:min-w-full items-center p-4 rounded-xl bg-white overflow-hidden '>
      <div>
        Selected seats{" "}
        <p className='p-5 text-center border border-slate-100 rounded-[5px]'>
          {`${selectedSeats}`}
        </p>
      </div>

      <div
        className=' flex flex-col flex-wrap justify-start lg:-mt-20'
        id='ticket'>
        <svg
          version='1.1'
          viewBox='0 0 2048 1150'
          width={"700px"}
          height='700px'
          xmlns='http://www.w3.org/2000/svg'
          className='flex justify-between max-sm:scale-[0.55] md:scale-[0.75] lg:scale-[1] -mt-20'
          fontFamily='Raleway Dots'
          fontWeight='bold'>
          <path
            transform='translate(212,272)'
            d='m0 0h1188l11 1 6 8 7 3 8-1 5-5 4-5 6-1h351l34 1 16 2 10 5 6 7 4 11 2 15v521l-2 20-4 11-7 8-8 4-9 2-11 1h-387l-6-11-4-3h-11l-5 4-5 10h-1211l-14-2-9-3-9-8-4-9-2-11v-543l3-12 6-10 7-5 11-3z'
            fill='#F1EBEBFF'
          />

          <text x='230' y='340' fontSize='50' fill='#333'>
            {`Bus Ticket purchased on ${currentDate.toDateString()}`}
          </text>
          <text x='230' y='400' fontSize='35' fill='#333'>
            {`Bus Company: ${busCompany}`}
          </text>
          <text x='230' y='450' fontSize='35' fill='#333'>
            {`Bus Number: ${busNumber}`}
          </text>
          <text x='230' y='500' fontSize='35' fill='#333'>
            {`Bus Type: ${busModel}`}
          </text>
          <text x='230' y='550' fontSize='35' fill='#333'>
            {`Route: ${busRoute.origin} → ${busRoute.destination}`}
          </text>
          <text x='230' y='600' fontSize='35' fill='#333'>
            {`Departure: ${tripDepartureTime}`}
          </text>
          <text x='230' y='650' fontSize='35' fill='#333'>
            {`Selected seats: ${
              selectedSeats.length > 10
                ? selectedSeats[0] +
                  "," +
                  selectedSeats[1] +
                  "," +
                  selectedSeats[2] +
                  ", and 9+ other seats. "
                : selectedSeats
            } `}
          </text>

          <text
            x='1350'
            y='720'
            fontSize='35'
            fill='#333'
            textAnchor='end'>
            {`Number of seats selected: ${selectedSeats.length} `}
          </text>
          <text
            x='1350'
            y='780'
            fontSize='35'
            fill='#333'
            textAnchor='end'>
            {`Fare per seat: ${currency} ${busFare.toLocaleString(
              "en-US"
            )}`}
          </text>
          <text
            x='1350'
            y='820'
            fontSize='35'
            fill='#333'
            textAnchor='end'>
            {`Total Cost: ${currency} ${totalCost.toLocaleString(
              "en-US"
            )}`}
          </text>

          <text x='230' y='860' fontSize='30' fill='#777'>
            {`TranzBook © ${currentDate.getFullYear()}`}
          </text>

          <line
            x1='1425'
            y1='285'
            x2='1425'
            y2='865'
            stroke='#000'
            strokeWidth='2'
            strokeDasharray='15,15'
          />

          <foreignObject
            x='1300'
            y='450'
            width='600'
            height='600'
            className='p-2'
            transform='rotate(-90 1600 575)'>
            <div className='min-h-full -my-28 flex flex-row justify-center items-center'>
              <Barcode
                value={ticketId.toString()}
                background='#F1EBEB00'
                width={1.76}
                height={300}
                textAlign='center'
              />
            </div>
          </foreignObject>
        </svg>
      </div>

      <Button
        className='bg-blue-500 p-2 max-sm:-mt-20 lg:mt-5 rounded-[5px] text-white hover:dark:text-black'
        variant='outline'
        onClick={() => {
          handleDownloadTicket();
        }}>
        Download Ticket
      </Button>
    </div>
  );
};

export default Ticket;
