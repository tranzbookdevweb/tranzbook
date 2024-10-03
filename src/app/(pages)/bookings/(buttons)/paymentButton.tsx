"use client";
import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handlePayments = usePaystackPayment({
    channels: ["mobile_money"],
    publicKey: "pk_live_ba22e79f57638ea1339bc93a0b40fae25e3814c8",
    phone: "0546871870",
    email: "sknukpezah@gmail.com",
    currency: "GHS",
    amount: busFare * selectedSeats.length * 100,
  });

  const onSuccess = (reference: any) => {
    handleBooking();
    alert(`Payment successful! Reference: ${reference.reference}`);
  };

  const onClose = () => {
    alert("Payment Not Successful");
  };

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
