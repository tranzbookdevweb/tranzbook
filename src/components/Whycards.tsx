import SearchIcon from "@mui/icons-material/Search";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PaymentIcon from "@mui/icons-material/Payment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CompareIcon from "@mui/icons-material/Compare";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, icon }) => (
  <div className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-start">
    <div className="mb-3">{icon}</div>
    <h5 className="text-xl font-semibold mb-2">{title}</h5>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface CargoCompanyFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  registrationNumber: string;
  logo: string;
  website: string;
  description: string;
  maxWeightCapacity: string;
  serviceAreas: string[];
  specializations: string[];
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  licenseNumber: string;
  insuranceDetails: string;
  operatingHours: string;
  emergencyContact: string;
}

interface WhycardsProps {
  activeButton: "Bus" | "Cargo";
}

function Whycards({ activeButton }: WhycardsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState<CargoCompanyFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    registrationNumber: "",
    logo: "",
    website: "",
    description: "",
    maxWeightCapacity: "",
    serviceAreas: [],
    specializations: [],
    contactPersonName: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    licenseNumber: "",
    insuranceDetails: "",
    operatingHours: "",
    emergencyContact: "",
  });

  const handleInputChange = (field: keyof CargoCompanyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: "serviceAreas" | "specializations", value: string) => {
    const areas = value.split(",").map(area => area.trim()).filter(area => area);
    setFormData(prev => ({ ...prev, [field]: areas }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const submitData = {
        ...formData,
        maxWeightCapacity: formData.maxWeightCapacity 
          ? parseFloat(formData.maxWeightCapacity) 
          : undefined,
      };

      const response = await fetch("/api/POST/postCargoCompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Cargo company registered successfully! We'll review your application and get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          address: "",
          city: "",
          country: "",
          registrationNumber: "",
          logo: "",
          website: "",
          description: "",
          maxWeightCapacity: "",
          serviceAreas: [],
          specializations: [],
          contactPersonName: "",
          contactPersonPhone: "",
          contactPersonEmail: "",
          licenseNumber: "",
          insuranceDetails: "",
          operatingHours: "",
          emergencyContact: "",
        });
        setTimeout(() => {
          setIsDialogOpen(false);
          setSubmitStatus({ type: null, message: "" });
        }, 3000);
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          type: "error",
          message: errorData.message || "Failed to register cargo company. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Conditional Content Based on Active Button */}
      {activeButton === "Bus" && (
        <>
          {/* How to Book Section */}
          <div className="mt-16">
            <h4 className="text-center text-2xl font-semibold mb-6">
              BOOK TICKET IN THREE STEPS:
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Search for Your Route",
                  description:
                    "Enter your departure and destination locations, select your travel date, and find available buses.",
                  icon: <SearchIcon className="text-blue-500" fontSize="large" />,
                },
                {
                  title: "Choose Your Bus",
                  description:
                    "Browse the options, check amenities, prices, and seat availability, then pick the bus that suits you best.",
                  icon: (
                    <DirectionsBusIcon className="text-green-500" fontSize="large" />
                  ),
                },
                {
                  title: "Confirm and Pay",
                  description:
                    "Enter your details, confirm the booking, and securely make your payment. You'll receive a ticket confirmation instantly!",
                  icon: <PaymentIcon className="text-red-500" fontSize="large" />,
                },
              ].map((step, index) => (
                <Card key={index} {...step} />
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-16 max-w-6xl mx-auto">
            <h4 className="text-center text-2xl font-semibold mb-6">
              How to Get Cheap Tickets
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "Book in Advance",
                  description:
                    "Early bookings typically offer the best discounts. Planning ahead can help you secure the lowest prices.",
                  icon: (
                    <BookmarkIcon className="text-purple-500" fontSize="large" />
                  ),
                },
                {
                  title: "Search and Compare Prices",
                  description:
                    "Use the search function to browse available buses, compare their prices, and choose the best deal for your journey.",
                  icon: (
                    <CompareIcon className="text-orange-500" fontSize="large" />
                  ),
                },
                {
                  title: "Refer Friends and Get Discounts",
                  description:
                    "Invite friends to TranzBook, and earn discounts on your next purchase when they book a ticket.",
                  icon: (
                    <PeopleIcon className="text-pink-500" fontSize="large" />
                  ),
                },
                {
                  title: "Sign Up for Alerts",
                  description:
                    "Subscribe to TranzBook's notifications for price drops and special deals so you never miss out on discounts.",
                  icon: (
                    <NotificationsActiveIcon
                      className="text-yellow-500"
                      fontSize="large"
                    />
                  ),
                },
              ].map((tip, index) => (
                <Card key={index} {...tip} />
              ))}
            </div>
          </div>
        </>
      )}

      {activeButton === "Cargo" && (
        <>
          {/* Cargo-Specific Content */}
          <div className="mt-16">
            <h4 className="text-center text-2xl font-semibold mb-6">
              BOOK A CARGO TRUCK IN THREE SIMPLE STEPS
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Fill Out the Form",
                  description:
                    "Enter your cargo pickup location, destination address, and preferred pickup date.",
                  icon: <SearchIcon className="text-blue-500" fontSize="large" />,
                },
                {
                  title: "Leave the Rest to Us",
                  description:
                    "Our supportive team will quickly get in touch to arrange your preferred truck, tailored to your cargo needs.",
                  icon: (
                    <DirectionsBusIcon className="text-green-500" fontSize="large" />
                  ),
                },
                {
                  title: "Track with Ease",
                  description:
                    "Sit back and relax while tracking your cargo in real-time as it safely and timely arrives at your desired destination.",
                  icon: <PaymentIcon className="text-red-500" fontSize="large" />,
                },
              ].map((step, index) => (
                <Card key={index} {...step} />
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-6xl mx-auto">
            <h4 className="text-center text-2xl font-semibold mb-6">
              OWN A TRUCK? LET&apos;S DRIVE SUCCESS TOGETHER!
            </h4>
            <p className="text-center text-gray-700 mb-6">
              Join TranzBook network and watch your cargo truck stay busy while you relax and enjoy consistent earnings. We connect you with reliable cargo needs, ensuring your truck never sits idle.
            </p>
               <p className="text-center text-blue-500 font-semibold mb-6">
              More business. More smiles. More trips to the bank. <span className="hover:cursor-pointer text-orange-500" onClick={() => setIsDialogOpen(true)}
>Sign up</span> now and start your journey to seamless earnings!
            </p>
            
            {/* Cargo Company Registration Dialog */}
            <div className="text-center">
          
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg z-[999999] justify-center bg-white overflow-hidden">
                  <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      Register Your Cargo Company
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Join our network of trusted cargo partners and start earning more with TranzBook
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea  className="border  max-h-[calc(85vh-120px)] pr-4">
                  
                    <div className="space-y-6 py-4">
                      {submitStatus.type && (
                        <Alert className={`${submitStatus.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"} mb-6`}>
                          <AlertDescription className={`${submitStatus.type === "success" ? "text-green-700" : "text-red-700"} font-medium`}>
                            {submitStatus.message}
                          </AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Basic Information</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Company Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                                Phone Number <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="registrationNumber" className="text-sm font-medium text-gray-700">
                                Registration Number
                              </Label>
                              <Input
                                id="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                              Business Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => handleInputChange("address", e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                City <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                Country <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => handleInputChange("country", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Company Details */}
                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Company Details</h4>
                          
                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                              Company Description
                            </Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                              placeholder="Tell us about your company, services, and experience..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                                Website
                              </Label>
                              <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) => handleInputChange("website", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="https://www.yourcompany.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="maxWeightCapacity" className="text-sm font-medium text-gray-700">
                                Max Weight Capacity (kg)
                              </Label>
                              <Input
                                id="maxWeightCapacity"
                                type="number"
                                value={formData.maxWeightCapacity}
                                onChange={(e) => handleInputChange("maxWeightCapacity", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="e.g., 10000"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="serviceAreas" className="text-sm font-medium text-gray-700">
                              Service Areas
                            </Label>
                            <Input
                              id="serviceAreas"
                              value={formData.serviceAreas.join(", ")}
                              onChange={(e) => handleArrayChange("serviceAreas", e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="e.g., Lagos, Abuja, Port Harcourt (comma-separated)"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="specializations" className="text-sm font-medium text-gray-700">
                              Specializations
                            </Label>
                            <Input
                              id="specializations"
                              value={formData.specializations.join(", ")}
                              onChange={(e) => handleArrayChange("specializations", e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="e.g., Heavy Equipment, Electronics, Perishables (comma-separated)"
                            />
                          </div>
                        </div>

                        {/* Contact Person */}
                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Contact Person</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="contactPersonName" className="text-sm font-medium text-gray-700">
                                Contact Person Name
                              </Label>
                              <Input
                                id="contactPersonName"
                                value={formData.contactPersonName}
                                onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contactPersonPhone" className="text-sm font-medium text-gray-700">
                                Contact Person Phone
                              </Label>
                              <Input
                                id="contactPersonPhone"
                                value={formData.contactPersonPhone}
                                onChange={(e) => handleInputChange("contactPersonPhone", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contactPersonEmail" className="text-sm font-medium text-gray-700">
                              Contact Person Email
                            </Label>
                            <Input
                              id="contactPersonEmail"
                              type="email"
                              value={formData.contactPersonEmail}
                              onChange={(e) => handleInputChange("contactPersonEmail", e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Business Information */}
                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Business Information</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700">
                                License Number
                              </Label>
                              <Input
                                id="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="operatingHours" className="text-sm font-medium text-gray-700">
                                Operating Hours
                              </Label>
                              <Input
                                id="operatingHours"
                                value={formData.operatingHours}
                                onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="e.g., Mon-Fri: 8AM-6PM"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="insuranceDetails" className="text-sm font-medium text-gray-700">
                              Insurance Details
                            </Label>
                            <Textarea
                              id="insuranceDetails"
                              value={formData.insuranceDetails}
                              onChange={(e) => handleInputChange("insuranceDetails", e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                              placeholder="Provide insurance company and policy details..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                              Emergency Contact
                            </Label>
                            <Input
                              id="emergencyContact"
                              value={formData.emergencyContact}
                              onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="24/7 emergency contact number"
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="flex-1 border-gray-300 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                          >
                            {isSubmitting ? "Registering..." : "Register Company"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Whycards;