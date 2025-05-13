"use client";
import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface PassengerDetail {
  name: string;
  age: string;
  phoneNumber: string;
  kinName: string;
  kinContact: string;
}

interface PaymentButtonProps {
  busFare: number;
  selectedSeats: string[];
  handleBooking: () => void;
  className?: string;
  disabled?: boolean;
  passengerDetailsFilled: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  busFare,
  selectedSeats,
  handleBooking,
  className,
  disabled,
  passengerDetailsFilled
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
    toast({
      title: "Payment cancelled",
      description: "Your payment was not completed.",
      variant: "destructive"
    });
  };

  const handleButtonClick = () => {
    if (email && passengerDetailsFilled && selectedSeats.length > 0) {
      handlePayments({ onSuccess, onClose });
    }
  };

  // Determine button text based on conditions
  const getButtonText = () => {
    if (selectedSeats.length === 0) {
      return "Select Seats First";
    } else if (!passengerDetailsFilled) {
      return "Please Fill Passenger Details";
    } else if (!email) {
      return "Loading...";
    } else {
      return `Pay GHS ${(selectedSeats.length * busFare).toLocaleString("en-US")}`;
    }
  };

  return (
    <Button
      onClick={handleButtonClick}
      className={className}
      disabled={disabled || !passengerDetailsFilled || selectedSeats.length === 0 || !email}
      variant="default"
    >
      {getButtonText()}
    </Button>
  );
};

export default PaymentButton;