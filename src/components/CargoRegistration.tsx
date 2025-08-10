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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Mail, Phone, MapPin, Globe, Truck, Shield, Clock, AlertTriangle } from "lucide-react";

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

interface CargoRegistrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CargoRegistrationDialog: React.FC<CargoRegistrationDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
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

  const resetForm = () => {
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
        resetForm();
        setTimeout(() => {
          onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl z-[999999] bg-white overflow-hidden shadow-2xl border-0 rounded-2xl">
        {/* Header with Logo and Gradient Background */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-6 -mx-6 -mt-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white backdrop-blur-sm rounded-xl p-3">
              <img 
                src="/logoalt.png" 
                alt="TranzBook Logo" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                //   e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center h-10 w-10 bg-white/20 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white mb-1">
                Register Your Cargo Company
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-base">
                Join our network of trusted cargo partners and start earning more with TranzBook
              </DialogDescription>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span className="text-sm font-medium">Step 1 of 1: Company Registration</span>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-200px)] px-1">
          <div className="space-y-8 pb-4">
            {submitStatus.type && (
              <Alert className={`${
                submitStatus.type === "success" 
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800" 
                  : "border-red-200 bg-red-50 text-red-800"
              } rounded-xl border-2 shadow-sm`}>
                <AlertTriangle className="h-5 w-5" />
                <AlertDescription className="font-medium ml-2">
                  {submitStatus.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-800">Basic Information</h4>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 text-base"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 text-base"
                      placeholder="company@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <Label htmlFor="phoneNumber" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 text-base"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="registrationNumber" className="text-sm font-semibold text-slate-700">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 text-base"
                      placeholder="Business registration number"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Label htmlFor="address" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Business Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 text-base"
                    placeholder="123 Business Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-sm font-semibold text-slate-700">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 text-base"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="country" className="text-sm font-semibold text-slate-700">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 text-base"
                      placeholder="Enter country"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 p-2 rounded-xl">
                    <Truck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-800">Company Details</h4>
                </div>
                
                <div className="space-y-3 mb-6">
                  <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                    Company Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 min-h-[120px] rounded-xl text-base"
                    placeholder="Tell us about your company, services, and experience in the cargo industry..."
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="website" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl h-12 text-base"
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="maxWeightCapacity" className="text-sm font-semibold text-slate-700">
                      Max Weight Capacity (kg)
                    </Label>
                    <Input
                      id="maxWeightCapacity"
                      type="number"
                      value={formData.maxWeightCapacity}
                      onChange={(e) => handleInputChange("maxWeightCapacity", e.target.value)}
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl h-12 text-base"
                      placeholder="e.g., 10000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <Label htmlFor="serviceAreas" className="text-sm font-semibold text-slate-700">
                      Service Areas
                    </Label>
                    <Input
                      id="serviceAreas"
                      value={formData.serviceAreas.join(", ")}
                      onChange={(e) => handleArrayChange("serviceAreas", e.target.value)}
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl h-12 text-base"
                      placeholder="Lagos, Abuja, Port Harcourt"
                    />
                    <p className="text-xs text-slate-500">Separate multiple areas with commas</p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="specializations" className="text-sm font-semibold text-slate-700">
                      Specializations
                    </Label>
                    <Input
                      id="specializations"
                      value={formData.specializations.join(", ")}
                      onChange={(e) => handleArrayChange("specializations", e.target.value)}
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl h-12 text-base"
                      placeholder="Heavy Equipment, Electronics, Perishables"
                    />
                    <p className="text-xs text-slate-500">Separate multiple specializations with commas</p>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <Mail className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-800">Contact Person</h4>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="contactPersonName" className="text-sm font-semibold text-slate-700">
                      Contact Person Name
                    </Label>
                    <Input
                      id="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                      className="border-slate-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl h-12 text-base"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="contactPersonPhone" className="text-sm font-semibold text-slate-700">
                      Contact Person Phone
                    </Label>
                    <Input
                      id="contactPersonPhone"
                      value={formData.contactPersonPhone}
                      onChange={(e) => handleInputChange("contactPersonPhone", e.target.value)}
                      className="border-slate-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl h-12 text-base"
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Label htmlFor="contactPersonEmail" className="text-sm font-semibold text-slate-700">
                    Contact Person Email
                  </Label>
                  <Input
                    id="contactPersonEmail"
                    type="email"
                    value={formData.contactPersonEmail}
                    onChange={(e) => handleInputChange("contactPersonEmail", e.target.value)}
                    className="border-slate-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl h-12 text-base"
                    placeholder="john.doe@company.com"
                  />
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-xl">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-800">Business Information</h4>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="licenseNumber" className="text-sm font-semibold text-slate-700">
                      License Number
                    </Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl h-12 text-base"
                      placeholder="Transport license number"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="operatingHours" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Operating Hours
                    </Label>
                    <Input
                      id="operatingHours"
                      value={formData.operatingHours}
                      onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                      className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl h-12 text-base"
                      placeholder="Mon-Fri: 8AM-6PM"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Label htmlFor="insuranceDetails" className="text-sm font-semibold text-slate-700">
                    Insurance Details
                  </Label>
                  <Textarea
                    id="insuranceDetails"
                    value={formData.insuranceDetails}
                    onChange={(e) => handleInputChange("insuranceDetails", e.target.value)}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 min-h-[100px] rounded-xl text-base"
                    placeholder="Provide insurance company and policy details..."
                  />
                </div>

                <div className="space-y-3 mt-6">
                  <Label htmlFor="emergencyContact" className="text-sm font-semibold text-slate-700">
                    Emergency Contact
                  </Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl h-12 text-base"
                    placeholder="24/7 emergency contact number"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1 h-12 border-2 border-slate-300 hover:bg-slate-50 rounded-xl font-semibold text-base transition-all duration-200"
                  >
                    Cancel Registration
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Registering Company...
                      </div>
                    ) : (
                      "Register Company"
                    )}
                  </Button>
                </div>
                
                <p className="text-center text-sm text-slate-500 mt-4">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CargoRegistrationDialog;