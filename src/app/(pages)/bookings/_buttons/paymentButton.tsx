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
  const [email, setEmail] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user email from the API
    const fetchEmail = async () => {
      try {
        const response = await fetch("/api/getEmail");
        if (!response.ok) {
          throw new Error("Failed to fetch email");
        }
        const data = await response.json();
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };

    fetchEmail();
  }, []);

  const handlePayments = usePaystackPayment({
    channels: ["mobile_money", "card", "bank", "bank_transfer"],
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY! as string,
    email: email || "default@example.com", // Use fetched email or fallback
    currency: "GHS",
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

  return (
    <button
      className={className}
      onClick={() => handlePayments({ onSuccess, onClose })}
      disabled={disabled || !email}>
      {email ? "Book Now" : "Loading..."}
    </button>
  );
};

export default PaymentButton;
