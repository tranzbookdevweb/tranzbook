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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, AlertCircle, Check, ChevronLeft, ChevronRight, Users, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PassengerDetail {
  name: string;
  phoneNumber: string;
  email?: string;
  kinName: string;
  kinContact: string;
  kinEmail?: string;
}

interface ValidationErrors {
  [key: string]: string;
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Initialize passenger details array when component mounts or when selectedSeats changes
  useEffect(() => {
    if (passengerDetails.length !== selectedSeats.length) {
      const initialDetails: PassengerDetail[] = Array(selectedSeats.length)
        .fill(null)
        .map(() => ({
          name: "",
          phoneNumber: "",
          email: "",
          kinName: "",
          kinContact: "",
          kinEmail: "",
        }));
      setPassengerDetails(initialDetails);
    }
  }, [selectedSeats.length, setPassengerDetails]);

  // Check if all required fields are filled
  useEffect(() => {
    const allFilled = passengerDetails.every(
      (passenger) =>
        passenger.name.trim() !== "" &&
        passenger.phoneNumber.trim() !== "" &&
        passenger.kinName.trim() !== "" &&
        passenger.kinContact.trim() !== ""
    );

    setPassengerDetailsFilled(allFilled && passengerDetails.length === selectedSeats.length);
  }, [passengerDetails, selectedSeats.length, setPassengerDetailsFilled]);

  const validateField = (field: string, value: string, passengerIndex: number): string => {
    const fieldKey = `${passengerIndex}-${field}`;
    
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        break;
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\+?[\d\s-()]{10,}$/.test(value)) return 'Please enter a valid phone number';
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        break;
      case 'kinName':
        if (!value.trim()) return 'Emergency contact name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        break;
      case 'kinContact':
        if (!value.trim()) return 'Emergency contact number is required';
        if (!/^\+?[\d\s-()]{10,}$/.test(value)) return 'Please enter a valid phone number';
        break;
      case 'kinEmail':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        break;
    }
    return '';
  };

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

    // Real-time validation
    const fieldKey = `${passengerIndex}-${field}`;
    const error = validateField(field, value, passengerIndex);
    
    setErrors(prev => ({
      ...prev,
      [fieldKey]: error
    }));
  };

  const handleFieldBlur = (passengerIndex: number, field: string) => {
    const fieldKey = `${passengerIndex}-${field}`;
    setTouchedFields(prev => {
      const newSet = new Set(prev);
      newSet.add(fieldKey);
      return newSet;
    });
  };

  const isPassengerComplete = (passengerIndex: number): boolean => {
    const passenger = passengerDetails[passengerIndex];
    if (!passenger) return false;
    
    return !!(
      passenger.name.trim() &&
      passenger.phoneNumber.trim() &&
      passenger.kinName.trim() &&
      passenger.kinContact.trim()
    );
  };

  const hasErrors = (passengerIndex: number): boolean => {
    const passengerErrors = Object.keys(errors).filter(key => 
      key.startsWith(`${passengerIndex}-`) && errors[key]
    );
    return passengerErrors.length > 0;
  };

  const moveToNextPassenger = (currentIndex: number) => {
    // Mark all fields as touched for validation display
    const fieldsToTouch = ['name', 'phoneNumber', 'kinName', 'kinContact'];
    setTouchedFields(prev => {
      const newTouchedFields = new Set(prev);
      fieldsToTouch.forEach(field => {
        newTouchedFields.add(`${currentIndex}-${field}`);
      });
      return newTouchedFields;
    });

    if (isPassengerComplete(currentIndex) && !hasErrors(currentIndex)) {
      if (currentIndex < selectedSeats.length - 1) {
        setActiveTab(`passenger-${currentIndex + 2}`);
      } else {
        setOpen(false);
      }
    }
  };

  const getCompletionCount = (): number => {
    return passengerDetails.filter(passenger => isPassengerComplete(passengerDetails.indexOf(passenger))).length;
  };

  const getProgressPercentage = (): number => {
    return selectedSeats.length > 0 ? (getCompletionCount() / selectedSeats.length) * 100 : 0;
  };

  const currentPassengerIndex = parseInt(activeTab.split('-')[1]) - 1;

  return (
    <>
      <Button
        variant="outline"
        className="w-full flex flex-col sm:flex-row justify-between items-center p-4 h-auto bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center mb-2 sm:mb-0">
          <Users className="mr-2 h-5 w-5" />
          <span className="font-medium">Passenger Details</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            {getCompletionCount()}/{selectedSeats.length} completed
          </div>
          <Badge
            variant={getCompletionCount() === selectedSeats.length ? "default" : "outline"}
            className={
              getCompletionCount() === selectedSeats.length
                ? "bg-green-500 text-white"
                : "border-orange-500 text-orange-500"
            }
          >
            {getCompletionCount() === selectedSeats.length ? (
              <Check className="h-3 w-3 mr-1" />
            ) : null}
            {getCompletionCount() === selectedSeats.length ? "Complete" : "Incomplete"}
          </Badge>
        </div>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] bg-white border-0 shadow-xl p-0 flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white">
            <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center">
                <Users className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Passenger Information
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-2 text-sm sm:text-base">
                Complete details for all {selectedSeats.length} passengers
              </DialogDescription>
              <div className="mt-3 sm:mt-4">
                <div className="flex justify-between text-xs sm:text-sm text-blue-100 mb-2">
                  <span>Progress</span>
                  <span>{getCompletionCount()}/{selectedSeats.length}</span>
                </div>
                <Progress 
                  value={getProgressPercentage()} 
                  className="h-2 bg-blue-800"
                />
              </div>
            </DialogHeader>

            {/* Sticky Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-flow-col auto-cols-fr px-4 sm:px-6 pt-3 sm:pt-4 pb-3 bg-white border-b">
                {selectedSeats.map((seat, index) => (
                  <TabsTrigger
                    key={index}
                    value={`passenger-${index + 1}`}
                    className="relative data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm"
                  >
                    <span className="flex items-center">
                      {isPassengerComplete(index) && (
                        <Check className="h-3 w-3 mr-1 text-green-500" />
                      )}
                      <span className="hidden sm:inline">Seat </span>{seat}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
              {selectedSeats.map((seat, index) => (
                <TabsContent key={index} value={`passenger-${index + 1}`} className="p-4 sm:p-6 m-0 h-full">
                  <Card className="border-2 border-gray-200 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4 sm:p-6">
                      <CardTitle className="text-blue-600 flex items-center text-lg sm:text-xl">
                        <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Passenger {index + 1} - Seat {seat}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Please provide accurate information for this passenger
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                      {/* Personal Information Section */}
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-gray-800 flex items-center border-b pb-2 text-sm sm:text-base">
                          <User className="h-4 w-4 mr-2" />
                          Personal Information
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${index}`} className="text-gray-700 font-medium text-sm">
                              Full Name *
                            </Label>
                            <Input
                              id={`name-${index}`}
                              value={passengerDetails[index]?.name || ""}
                              onChange={(e) => handleInputChange(index, "name", e.target.value)}
                              onBlur={() => handleFieldBlur(index, "name")}
                              placeholder="Enter full name as on ID"
                              className={`border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-sm sm:text-base ${
                                touchedFields.has(`${index}-name`) && errors[`${index}-name`] ? 'border-red-500' : ''
                              }`}
                            />
                            {touchedFields.has(`${index}-name`) && errors[`${index}-name`] && (
                              <p className="text-red-600 text-xs sm:text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[`${index}-name`]}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`phone-${index}`} className="text-gray-700 font-medium text-sm">
                              Phone Number *
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id={`phone-${index}`}
                                value={passengerDetails[index]?.phoneNumber || ""}
                                onChange={(e) => handleInputChange(index, "phoneNumber", e.target.value)}
                                onBlur={() => handleFieldBlur(index, "phoneNumber")}
                                placeholder="+233 XX XXX XXXX"
                                type="tel"
                                className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-sm sm:text-base ${
                                  touchedFields.has(`${index}-phoneNumber`) && errors[`${index}-phoneNumber`] ? 'border-red-500' : ''
                                }`}
                              />
                            </div>
                            {touchedFields.has(`${index}-phoneNumber`) && errors[`${index}-phoneNumber`] && (
                              <p className="text-red-600 text-xs sm:text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[`${index}-phoneNumber`]}
                              </p>
                            )}
                          </div>
                        
                          <div className="space-y-2">
                            <Label htmlFor={`email-${index}`} className="text-gray-700 font-medium text-sm">
                              Email Address (Optional)
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id={`email-${index}`}
                                value={passengerDetails[index]?.email || ""}
                                onChange={(e) => handleInputChange(index, "email", e.target.value)}
                                onBlur={() => handleFieldBlur(index, "email")}
                                placeholder="email@example.com"
                                type="email"
                                className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-sm sm:text-base ${
                                  touchedFields.has(`${index}-email`) && errors[`${index}-email`] ? 'border-red-500' : ''
                                }`}
                              />
                            </div>
                            {touchedFields.has(`${index}-email`) && errors[`${index}-email`] && (
                              <p className="text-red-600 text-xs sm:text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[`${index}-email`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact Section */}
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-gray-800 flex items-center border-b pb-2 text-sm sm:text-base">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Emergency Contact
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`kin-name-${index}`} className="text-gray-700 font-medium text-sm">
                              Contact Name *
                            </Label>
                            <Input
                              id={`kin-name-${index}`}
                              value={passengerDetails[index]?.kinName || ""}
                              onChange={(e) => handleInputChange(index, "kinName", e.target.value)}
                              onBlur={() => handleFieldBlur(index, "kinName")}
                              placeholder="Emergency contact full name"
                              className={`border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-sm sm:text-base ${
                                touchedFields.has(`${index}-kinName`) && errors[`${index}-kinName`] ? 'border-red-500' : ''
                              }`}
                            />
                            {touchedFields.has(`${index}-kinName`) && errors[`${index}-kinName`] && (
                              <p className="text-red-600 text-xs sm:text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[`${index}-kinName`]}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`kin-contact-${index}`} className="text-gray-700 font-medium text-sm">
                              Contact Number *
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id={`kin-contact-${index}`}
                                value={passengerDetails[index]?.kinContact || ""}
                                onChange={(e) => handleInputChange(index, "kinContact", e.target.value)}
                                onBlur={() => handleFieldBlur(index, "kinContact")}
                                placeholder="+233 XX XXX XXXX"
                                type="tel"
                                className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-sm sm:text-base ${
                                  touchedFields.has(`${index}-kinContact`) && errors[`${index}-kinContact`] ? 'border-red-500' : ''
                                }`}
                              />
                            </div>
                            {touchedFields.has(`${index}-kinContact`) && errors[`${index}-kinContact`] && (
                              <p className="text-red-600 text-xs sm:text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[`${index}-kinContact`]}
                              </p>
                            )}
                          </div>
                        
                          <div className="space-y-2">
                            <Label htmlFor={`kin-email-${index}`} className="text-gray-700 font-medium text-sm">
                              Contact Email (Optional)
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id={`kin-email-${index}`}
                                value={passengerDetails[index]?.kinEmail || ""}
                                onChange={(e) => handleInputChange(index, "kinEmail", e.target.value)}
                                onBlur={() => handleFieldBlur(index, "kinEmail")}
                                placeholder="contact@example.com"
                                type="email"
                                className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-sm sm:text-base ${
                                  touchedFields.has(`${index}-kinEmail`) && errors[`${index}-kinEmail`] ? 'border-red-500' : ''
                                }`}
                              />
                            </div>
                            {touchedFields.has(`${index}-kinEmail`) && errors[`${index}-kinEmail`] && (
                              <p className="text-red-600 text-xs sm:text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[`${index}-kinEmail`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab(`passenger-${index}`)}
                        disabled={index === 0}
                        className="border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-50 text-sm"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </Button>
                      
                      {index < selectedSeats.length - 1 ? (
                        <Button
                          onClick={() => moveToNextPassenger(index)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <span className="sm:hidden">Next</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            // Mark fields as touched
                            const fieldsToTouch = ['name', 'phoneNumber', 'kinName', 'kinContact'];
                            setTouchedFields(prev => {
                              const newTouchedFields = new Set(prev);
                              fieldsToTouch.forEach(field => {
                                newTouchedFields.add(`${index}-${field}`);
                              });
                              return newTouchedFields;
                            });

                            if (isPassengerComplete(index) && !hasErrors(index)) {
                              setOpen(false);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};


export default PassengerDetails;