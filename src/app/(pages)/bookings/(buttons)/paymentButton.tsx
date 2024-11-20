"use client";
import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { useToast } from "@/components/ui/use-toast";

interface PaymentButtonProps {
  busFare: number;
  selectedSeats: string[];
  className: string;
  handleBooking: () => void;
  disabled: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  busFare,
  selectedSeats,
  className,
  handleBooking,
  disabled,
}) => {
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();


  const handlePayments = usePaystackPayment({
    channels: ["mobile_money","card","bank","bank_transfer"],
    // in .env: NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_9559bad7cb4e0cdbb1570bcfd85c46d9fe8296ee"
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY! as string,
    // phone: "0546871870", //not needed
    email: "sknukpezah@gmail.com", //use the user's email from the tranzbook users table from the db
    currency: "GHS",
    // amount: 1 * 100 , //for testing = 1ghc
    amount: busFare * selectedSeats.length * 100,
  });

  const onSuccess = (reference: any) => {
    handleBooking();
    
    toast({
      title: "Booking successful!",
      description: `Payment successful! Reference: ${reference.reference}`,
    });
  };

  const onClose = () => {
    alert("Payment Not Successful");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <button
      className={className}
      onClick={() => handlePayments({ onSuccess, onClose })}
      disabled={disabled}>
      Book Now
    </button>
  );
};

export default PaymentButton;
