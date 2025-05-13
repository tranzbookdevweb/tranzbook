'use client'
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PassengerDetail {
  name: string;
  age: string;
  phoneNumber: string;
  kinName: string;
  kinContact: string;
}

interface PassengerDetailsProps {
  selectedSeats: string[];
  setPassengerDetailsFilled: (filled: boolean) => void;
  passengerDetails: PassengerDetail[];
  setPassengerDetails: (details: PassengerDetail[]) => void;
}

const PassengerDetails: React.FC<PassengerDetailsProps> = ({
  selectedSeats,
  setPassengerDetailsFilled,
  passengerDetails,
  setPassengerDetails,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("passenger-1");
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize passenger details array when component mounts or when selectedSeats changes
  useEffect(() => {
    if (passengerDetails.length !== selectedSeats.length) {
      const initialDetails: PassengerDetail[] = Array(selectedSeats.length)
        .fill(null)
        .map(() => ({
          name: "",
          age: "",
          phoneNumber: "",
          kinName: "",
          kinContact: "",
        }));
      setPassengerDetails(initialDetails);
    }
  }, [selectedSeats.length, setPassengerDetails]);

  // Check if all required fields are filled
  useEffect(() => {
    const allFilled = passengerDetails.every(
      (passenger) =>
        passenger.name.trim() !== "" &&
        passenger.age.trim() !== "" &&
        passenger.phoneNumber.trim() !== "" &&
        passenger.kinName.trim() !== "" &&
        passenger.kinContact.trim() !== ""
    );

    setPassengerDetailsFilled(allFilled && passengerDetails.length === selectedSeats.length);
  }, [passengerDetails, selectedSeats.length, setPassengerDetailsFilled]);

  const handleInputChange = (
    passengerIndex: number,
    field: keyof PassengerDetail,
    value: string
  ) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[passengerIndex] = {
      ...updatedDetails[passengerIndex],
      [field]: value,
    };
    setPassengerDetails(updatedDetails);
    setFormError(null);
  };

  const validatePassengerForm = (passengerIndex: number): boolean => {
    const passenger = passengerDetails[passengerIndex];
    
    if (!passenger.name || !passenger.age || !passenger.phoneNumber || 
        !passenger.kinName || !passenger.kinContact) {
      setFormError("All fields are required");
      return false;
    }
    
    // Validate age is a number between 1 and 120
    const age = parseInt(passenger.age);
    if (isNaN(age) || age < 1 || age > 120) {
      setFormError("Age must be a valid number between 1 and 120");
      return false;
    }
    
    // Basic phone validation (at least 10 digits)
    if (!/^\d{10,}$/.test(passenger.phoneNumber)) {
      setFormError("Phone number must have at least 10 digits");
      return false;
    }
    
    // Basic phone validation for kin contact
    if (!/^\d{10,}$/.test(passenger.kinContact)) {
      setFormError("Kin contact must have at least 10 digits");
      return false;
    }
    
    return true;
  };

  const moveToNextPassenger = (currentIndex: number) => {
    if (validatePassengerForm(currentIndex)) {
      if (currentIndex < selectedSeats.length - 1) {
        setActiveTab(`passenger-${currentIndex + 2}`);
      } else {
        setOpen(false);
      }
    }
  };

  const getCompletionStatus = (): string => {
    const filledCount = passengerDetails.filter(
      (p) => 
        p.name.trim() !== "" && 
        p.age.trim() !== "" && 
        p.phoneNumber.trim() !== "" && 
        p.kinName.trim() !== "" && 
        p.kinContact.trim() !== ""
    ).length;
    
    return `${filledCount}/${selectedSeats.length}`;
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full flex justify-between items-center bg-white border-blue-500 text-blue-600 hover:bg-blue-50"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center">
          <UserIcon className="mr-2 h-4 w-4" />
          Passenger Details
        </span>
        <Badge variant={passengerDetails.length === selectedSeats.length && 
                        passengerDetails.every(p => 
                          p.name && p.age && p.phoneNumber && p.kinName && p.kinContact
                        ) ? "default" : "outline"}
               className={passengerDetails.length === selectedSeats.length && 
                         passengerDetails.every(p => 
                           p.name && p.age && p.phoneNumber && p.kinName && p.kinContact
                         ) ? "bg-orange-500 text-white" : "border-orange-500 text-orange-500"}>
          {getCompletionStatus()}
        </Badge>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md md:max-w-lg bg-white border-0 shadow-lg p-0 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5">
          <DialogHeader className="p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <DialogTitle className="text-xl font-semibold">Passenger Information</DialogTitle>
            <DialogDescription className="text-blue-100">
              Please fill in the details for each passenger
            </DialogDescription>
          </DialogHeader>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full z-50"
          >
            <TabsList className="grid grid-flow-col auto-cols-fr px-4 pt-4 bg-white">
              {selectedSeats.map((seat, index) => (
                <TabsTrigger key={index} value={`passenger-${index + 1}`}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Seat {seat}
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedSeats.map((seat, index) => (
              <TabsContent key={index} value={`passenger-${index + 1}`} className="p-4">
                <div className="h-96 overflow-y-auto text-black w-full">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                      <CardTitle className="text-blue-600">Passenger {index + 1} - Seat {seat}</CardTitle>
                      <CardDescription>
                        Enter passenger details for seat {seat}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      {formError && (
                        <div className="bg-red-50 p-3 rounded-md flex items-center text-red-800 text-sm">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          {formError}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`} className="text-gray-700">Full Name</Label>
                        <Input
                          id={`name-${index}`}
                          value={passengerDetails[index]?.name || ""}
                          onChange={(e) => handleInputChange(index, "name", e.target.value)}
                          placeholder="Enter full name"
                          className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`age-${index}`} className="text-gray-700">Age</Label>
                        <Input
                          id={`age-${index}`}
                          type="number"
                          value={passengerDetails[index]?.age || ""}
                          onChange={(e) => handleInputChange(index, "age", e.target.value)}
                          placeholder="Enter age"
                          min="1"
                          max="120"
                          className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`phone-${index}`} className="text-gray-700">Phone Number</Label>
                        <Input
                          id={`phone-${index}`}
                          value={passengerDetails[index]?.phoneNumber || ""}
                          onChange={(e) => handleInputChange(index, "phoneNumber", e.target.value)}
                          placeholder="Enter phone number"
                          type="tel"
                          className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`kin-name-${index}`} className="text-gray-700">Next of Kin Name</Label>
                        <Input
                          id={`kin-name-${index}`}
                          value={passengerDetails[index]?.kinName || ""}
                          onChange={(e) => handleInputChange(index, "kinName", e.target.value)}
                          placeholder="Enter next of kin name"
                          className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`kin-contact-${index}`} className="text-gray-700">Next of Kin Contact</Label>
                        <Input
                          id={`kin-contact-${index}`}
                          value={passengerDetails[index]?.kinContact || ""}
                          onChange={(e) => handleInputChange(index, "kinContact", e.target.value)}
                          placeholder="Enter next of kin contact"
                          type="tel"
                          className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-200 p-4">
                      {index > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab(`passenger-${index}`)}
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          Previous
                        </Button>
                      )}
                      {index < selectedSeats.length - 1 ? (
                        <Button 
                          onClick={() => moveToNextPassenger(index)}
                          className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => {
                            if (validatePassengerForm(index)) {
                              setOpen(false);
                            }
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white ml-auto"
                        >
                          Save
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PassengerDetails;
