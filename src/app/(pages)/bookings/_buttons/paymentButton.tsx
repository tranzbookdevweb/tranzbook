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
  const [userContact, setUserContact] = useState<string | null>(null);
  const [contactType, setContactType] = useState<'email' | 'phone' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user contact info from the API
    const fetchUserContact = async () => {
      try {
        const response = await fetch("/api/getEmail");
        if (!response.ok) {
          throw new Error("Failed to fetch user contact");
        }
        const data = await response.json();
        
        // Set the contact and determine type
        if (data.email) {
          setUserContact(data.email);
          setContactType('email');
        } else if (data.phoneNumber) {
          setUserContact(data.phoneNumber);
          setContactType('phone');
        } else {
          console.error("No email or phone number available");
        }
      } catch (error) {
        console.error("Error fetching user contact:", error);
      }
    };

    fetchUserContact();
  }, []);

  const handlePayments = usePaystackPayment({
    channels: ["mobile_money", "card", "bank", "bank_transfer"],
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY! as string,
    email: contactType === 'email' ? userContact! : `${userContact}@temp.com`, // Paystack requires email format
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
    if (userContact && passengerDetailsFilled && selectedSeats.length > 0) {
      handlePayments({ onSuccess, onClose });
    }
  };

  // Determine button text based on conditions
  const getButtonText = () => {
    if (selectedSeats.length === 0) {
      return "Select Seats First";
    } else if (!passengerDetailsFilled) {
      return "Please Fill Passenger Details";
    } else if (!userContact) {
      return "Loading...";
    } else {
      return `Pay GHS ${(selectedSeats.length * busFare).toLocaleString("en-US")}`;
    }
  };

  return (
    <Button
      onClick={handleButtonClick}
      className={className}
      disabled={disabled || !passengerDetailsFilled || selectedSeats.length === 0 || !userContact}
      variant="default"
    >
      {getButtonText()}
    </Button>
  );
};

export default PaymentButton;