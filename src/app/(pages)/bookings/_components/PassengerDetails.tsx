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
import { User, AlertCircle, Check, ChevronLeft, ChevronRight, Users, Phone, Mail, UserCheck, Shield } from "lucide-react";
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
        passenger.email && passenger.email.trim() !== "" &&
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
        if (!value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
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
      passenger.email && passenger.email.trim() &&
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
    const fieldsToTouch = ['name', 'phoneNumber', 'email', 'kinName', 'kinContact'];
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
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <Button
          variant="outline"
          className="relative w-full flex flex-col sm:flex-row justify-between items-center p-6 h-auto bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="p-2 bg-slate-100 rounded-lg mr-3">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-800">Passenger Information</div>
              <div className="text-sm text-slate-500">Complete traveler details</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-800">
                {getCompletionCount()}/{selectedSeats.length}
              </div>
              <div className="text-xs text-slate-500">completed</div>
            </div>
            <Badge
              variant={getCompletionCount() === selectedSeats.length ? "default" : "outline"}
              className={`px-3 py-1 font-medium ${
                getCompletionCount() === selectedSeats.length
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "border-amber-300 text-amber-700 bg-amber-50"
              }`}
            >
              {getCompletionCount() === selectedSeats.length ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Complete
                </>
              ) : (
                "Pending"
              )}
            </Badge>
          </div>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] z-[999999] max-w-3xl max-h-[90vh] bg-white border-0 shadow-2xl p-0 flex flex-col rounded-2xl overflow-hidden">
          {/* Modern Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white">
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-white/10 rounded-xl mr-4 backdrop-blur-sm">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      Passenger Details
                    </DialogTitle>
                    <DialogDescription className="text-slate-300 mt-1">
                      Secure information collection for {selectedSeats.length} travelers
                    </DialogDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-300">Progress</div>
                  <div className="text-lg font-bold">{Math.round(getProgressPercentage())}%</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>Completion Status</span>
                  <span>{getCompletionCount()} of {selectedSeats.length}</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={getProgressPercentage()} 
                    className="h-2 bg-slate-700 rounded-full overflow-hidden"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full"></div>
                </div>
              </div>
            </DialogHeader>

            {/* Modern Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pb-4">
                <TabsList className="grid grid-flow-col auto-cols-fr bg-white/10 backdrop-blur-sm rounded-xl p-1 w-full">
                  {selectedSeats.map((seat, index) => (
                    <TabsTrigger
                      key={index}
                      value={`passenger-${index + 1}`}
                      className="relative data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300 text-white/70 hover:text-white font-medium px-4 py-2 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        {isPassengerComplete(index) ? (
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                        )}
                        <span className="hidden sm:inline">Seat {seat}</span>
                        <span className="sm:hidden">{seat}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
              {selectedSeats.map((seat, index) => (
                <TabsContent key={index} value={`passenger-${index + 1}`} className="p-6 m-0 h-full">
                  <div className="max-w-2xl mx-auto">
                    <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-3 bg-slate-100 rounded-xl mr-4">
                              <User className="h-6 w-6 text-slate-600" />
                            </div>
                            <div>
                              <CardTitle className="text-slate-800 text-xl font-bold">
                                Passenger {index + 1}
                              </CardTitle>
                              <CardDescription className="text-slate-500 mt-1">
                                Seat {seat} • Required information
                              </CardDescription>
                            </div>
                          </div>
                          {isPassengerComplete(index) && (
                            <div className="p-2 bg-emerald-100 rounded-xl">
                              <Check className="h-5 w-5 text-emerald-600" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-6 space-y-8">
                        {/* Personal Information Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-slate-800 text-lg">Personal Information</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="lg:col-span-2 space-y-2">
                              <Label htmlFor={`name-${index}`} className="text-slate-700 font-medium flex items-center">
                                Full Name
                                <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id={`name-${index}`}
                                value={passengerDetails[index]?.name || ""}
                                onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                onBlur={() => handleFieldBlur(index, "name")}
                                placeholder="Enter full name as shown on ID"
                                className={`h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl ${
                                  touchedFields.has(`${index}-name`) && errors[`${index}-name`] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                                }`}
                              />
                              {touchedFields.has(`${index}-name`) && errors[`${index}-name`] && (
                                <p className="text-red-600 text-sm flex items-center mt-2">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  {errors[`${index}-name`]}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`phone-${index}`} className="text-slate-700 font-medium flex items-center">
                                Phone Number
                                <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                  <Phone className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                  id={`phone-${index}`}
                                  value={passengerDetails[index]?.phoneNumber || ""}
                                  onChange={(e) => handleInputChange(index, "phoneNumber", e.target.value)}
                                  onBlur={() => handleFieldBlur(index, "phoneNumber")}
                                  placeholder="+233 XX XXX XXXX"
                                  type="tel"
                                  className={`h-12 pl-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl ${
                                    touchedFields.has(`${index}-phoneNumber`) && errors[`${index}-phoneNumber`] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                                  }`}
                                />
                              </div>
                              {touchedFields.has(`${index}-phoneNumber`) && errors[`${index}-phoneNumber`] && (
                                <p className="text-red-600 text-sm flex items-center mt-2">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  {errors[`${index}-phoneNumber`]}
                                </p>
                              )}
                            </div>
                          
                            <div className="space-y-2">
                              <Label htmlFor={`email-${index}`} className="text-slate-700 font-medium flex items-center">
                                Email Address
                                <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                  <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                  id={`email-${index}`}
                                  value={passengerDetails[index]?.email || ""}
                                  onChange={(e) => handleInputChange(index, "email", e.target.value)}
                                  onBlur={() => handleFieldBlur(index, "email")}
                                  placeholder="passenger@example.com"
                                  type="email"
                                  className={`h-12 pl-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl ${
                                    touchedFields.has(`${index}-email`) && errors[`${index}-email`] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                                  }`}
                                />
                              </div>
                              {touchedFields.has(`${index}-email`) && errors[`${index}-email`] && (
                                <p className="text-red-600 text-sm flex items-center mt-2">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  {errors[`${index}-email`]}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Emergency Contact Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <Shield className="h-4 w-4 text-red-600" />
                            </div>
                            <h4 className="font-semibold text-slate-800 text-lg">Emergency Contact</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="lg:col-span-2 space-y-2">
                              <Label htmlFor={`kin-name-${index}`} className="text-slate-700 font-medium flex items-center">
                                Contact Name
                                <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id={`kin-name-${index}`}
                                value={passengerDetails[index]?.kinName || ""}
                                onChange={(e) => handleInputChange(index, "kinName", e.target.value)}
                                onBlur={() => handleFieldBlur(index, "kinName")}
                                placeholder="Emergency contact full name"
                                className={`h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl ${
                                  touchedFields.has(`${index}-kinName`) && errors[`${index}-kinName`] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                                }`}
                              />
                              {touchedFields.has(`${index}-kinName`) && errors[`${index}-kinName`] && (
                                <p className="text-red-600 text-sm flex items-center mt-2">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  {errors[`${index}-kinName`]}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`kin-contact-${index}`} className="text-slate-700 font-medium flex items-center">
                                Contact Number
                                <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                  <Phone className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                  id={`kin-contact-${index}`}
                                  value={passengerDetails[index]?.kinContact || ""}
                                  onChange={(e) => handleInputChange(index, "kinContact", e.target.value)}
                                  onBlur={() => handleFieldBlur(index, "kinContact")}
                                  placeholder="+233 XX XXX XXXX"
                                  type="tel"
                                  className={`h-12 pl-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl ${
                                    touchedFields.has(`${index}-kinContact`) && errors[`${index}-kinContact`] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                                  }`}
                                />
                              </div>
                              {touchedFields.has(`${index}-kinContact`) && errors[`${index}-kinContact`] && (
                                <p className="text-red-600 text-sm flex items-center mt-2">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  {errors[`${index}-kinContact`]}
                                </p>
                              )}
                            </div>
                          
                            <div className="space-y-2">
                              <Label htmlFor={`kin-email-${index}`} className="text-slate-700 font-medium">
                                Contact Email
                                <span className="text-slate-400 ml-2 text-sm">(Optional)</span>
                              </Label>
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                  <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                  id={`kin-email-${index}`}
                                  value={passengerDetails[index]?.kinEmail || ""}
                                  onChange={(e) => handleInputChange(index, "kinEmail", e.target.value)}
                                  onBlur={() => handleFieldBlur(index, "kinEmail")}
                                  placeholder="contact@example.com"
                                  type="email"
                                  className={`h-12 pl-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl ${
                                    touchedFields.has(`${index}-kinEmail`) && errors[`${index}-kinEmail`] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                                  }`}
                                />
                              </div>
                              {touchedFields.has(`${index}-kinEmail`) && errors[`${index}-kinEmail`] && (
                                <p className="text-red-600 text-sm flex items-center mt-2">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  {errors[`${index}-kinEmail`]}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between bg-slate-50 border-t border-slate-100 p-6">
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab(`passenger-${index}`)}
                          disabled={index === 0}
                          className="border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 h-12 px-6 rounded-xl font-medium"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        
                        {index < selectedSeats.length - 1 ? (
                          <Button
                            onClick={() => moveToNextPassenger(index)}
                            className="bg-slate-800 hover:bg-slate-900 text-white h-12 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Continue
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              // Mark fields as touched
                              const fieldsToTouch = ['name', 'phoneNumber', 'email', 'kinName', 'kinContact'];
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Complete
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
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