import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Printer, Download } from "lucide-react";
import { format } from "date-fns";

const BirthCertificate = () => {
  const [certificateData, setCertificateData] = useState({
    childName: "",
    gender: "",
    dateOfBirth: format(new Date(), "yyyy-MM-dd"),
    timeOfBirth: format(new Date(), "HH:mm"),
    placeOfBirth: "Hospital",
    weight: "",
    length: "",
    motherName: "",
    motherAge: "",
    motherNationality: "",
    fatherName: "",
    fatherAge: "",
    fatherNationality: "",
    address: "",
    contactNumber: "",
    attendingDoctor: "",
    doctorDesignation: "",
    doctorRegistrationNo: "",
    complications: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setCertificateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Birth Certificate</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Certificate Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Child Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="childName">Child's Full Name</Label>
                <Input
                  id="childName"
                  name="childName"
                  value={certificateData.childName}
                  onChange={handleChange}
                  placeholder="Child's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={certificateData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={certificateData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeOfBirth">Time of Birth</Label>
                <Input
                  id="timeOfBirth"
                  name="timeOfBirth"
                  type="time"
                  value={certificateData.timeOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Place of Birth</Label>
                <Select
                  value={certificateData.placeOfBirth}
                  onValueChange={(value) =>
                    handleSelectChange("placeOfBirth", value)
                  }
                >
                  <SelectTrigger id="placeOfBirth">
                    <SelectValue placeholder="Select place" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hospital">Hospital</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Birth Weight (grams)</Label>
                <Input
                  id="weight"
                  name="weight"
                  value={certificateData.weight}
                  onChange={handleChange}
                  placeholder="Weight in grams"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Birth Length (cm)</Label>
                <Input
                  id="length"
                  name="length"
                  value={certificateData.length}
                  onChange={handleChange}
                  placeholder="Length in centimeters"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parents Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">Mother's Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Full Name</Label>
                  <Input
                    id="motherName"
                    name="motherName"
                    value={certificateData.motherName}
                    onChange={handleChange}
                    placeholder="Mother's full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherAge">Mother's Age</Label>
                  <Input
                    id="motherAge"
                    name="motherAge"
                    value={certificateData.motherAge}
                    onChange={handleChange}
                    placeholder="Mother's age"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherNationality">
                    Mother's Nationality
                  </Label>
                  <Input
                    id="motherNationality"
                    name="motherNationality"
                    value={certificateData.motherNationality}
                    onChange={handleChange}
                    placeholder="Mother's nationality"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Father's Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Full Name</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={certificateData.fatherName}
                    onChange={handleChange}
                    placeholder="Father's full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherAge">Father's Age</Label>
                  <Input
                    id="fatherAge"
                    name="fatherAge"
                    value={certificateData.fatherAge}
                    onChange={handleChange}
                    placeholder="Father's age"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherNationality">
                    Father's Nationality
                  </Label>
                  <Input
                    id="fatherNationality"
                    name="fatherNationality"
                    value={certificateData.fatherNationality}
                    onChange={handleChange}
                    placeholder="Father's nationality"
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="address">Permanent Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={certificateData.address}
                  onChange={handleChange}
                  placeholder="Permanent address"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={certificateData.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact number"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="attendingDoctor">Attending Doctor</Label>
                <Input
                  id="attendingDoctor"
                  name="attendingDoctor"
                  value={certificateData.attendingDoctor}
                  onChange={handleChange}
                  placeholder="Doctor's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorDesignation">Designation</Label>
                <Input
                  id="doctorDesignation"
                  name="doctorDesignation"
                  value={certificateData.doctorDesignation}
                  onChange={handleChange}
                  placeholder="Doctor's designation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorRegistrationNo">Registration No.</Label>
                <Input
                  id="doctorRegistrationNo"
                  name="doctorRegistrationNo"
                  value={certificateData.doctorRegistrationNo}
                  onChange={handleChange}
                  placeholder="Medical registration number"
                />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                <Label htmlFor="complications">
                  Delivery Complications (if any)
                </Label>
                <Textarea
                  id="complications"
                  name="complications"
                  value={certificateData.complications}
                  onChange={handleChange}
                  placeholder="Any complications during delivery"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                <Label htmlFor="remarks">Additional Remarks</Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  value={certificateData.remarks}
                  onChange={handleChange}
                  placeholder="Any additional information"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card className="print-container bg-white">
            <CardContent className="p-8">
              <div className="text-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase mb-1">
                  Birth Certificate
                </h1>
                <p className="text-muted-foreground">
                  Official Medical Certificate of Birth
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                  Child Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="font-medium w-1/3">Full Name:</span>
                      <span className="w-2/3">
                        {certificateData.childName || "[Not Specified]"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/3">Gender:</span>
                      <span className="w-2/3">
                        {certificateData.gender
                          ? certificateData.gender.charAt(0).toUpperCase() +
                            certificateData.gender.slice(1)
                          : "[Not Specified]"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/3">Date of Birth:</span>
                      <span className="w-2/3">
                        {certificateData.dateOfBirth || "[Not Specified]"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="font-medium w-1/3">Time of Birth:</span>
                      <span className="w-2/3">
                        {certificateData.timeOfBirth || "[Not Specified]"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/3">Weight:</span>
                      <span className="w-2/3">
                        {certificateData.weight
                          ? `${certificateData.weight} grams`
                          : "[Not Specified]"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/3">Length:</span>
                      <span className="w-2/3">
                        {certificateData.length
                          ? `${certificateData.length} cm`
                          : "[Not Specified]"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                    Mother's Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="font-medium w-1/3">Full Name:</span>
                      <span className="w-2/3">
                        {certificateData.motherName || "[Not Specified]"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/3">Age:</span>
                      <span className="w-2/3">
                        {certificateData.motherAge || "[Not Specified]"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/3">Nationality:</span>
                      <span className="w-2/3">
                        {certificateData.motherNationality || "[Not Specified]"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                    Father's Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="font-medium w-1/3">Full Name:</span>
                      <span className="w-2/3">
                        {certificateData.fatherName || "[Not Specified]"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/3">Age:</span>
                      <span className="w-2/3">
                        {certificateData.fatherAge || "[Not Specified]"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/3">Nationality:</span>
                      <span className="w-2/3">
                        {certificateData.fatherNationality || "[Not Specified]"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-1/4">Address:</span>
                    <span className="w-3/4">
                      {certificateData.address || "[Not Specified]"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-1/4">Contact Number:</span>
                    <span className="w-3/4">
                      {certificateData.contactNumber || "[Not Specified]"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                  Medical Certification
                </h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-1/3">Attending Doctor:</span>
                    <span className="w-2/3">
                      {certificateData.attendingDoctor || "[Not Specified]"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-1/3">Designation:</span>
                    <span className="w-2/3">
                      {certificateData.doctorDesignation || "[Not Specified]"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-1/3">Registration No:</span>
                    <span className="w-2/3">
                      {certificateData.doctorRegistrationNo ||
                        "[Not Specified]"}
                    </span>
                  </div>
                </div>
              </div>

              {certificateData.complications && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                    Delivery Complications
                  </h3>
                  <p className="border p-2 min-h-[60px] bg-gray-50">
                    {certificateData.complications}
                  </p>
                </div>
              )}

              {certificateData.remarks && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                    Additional Remarks
                  </h3>
                  <p className="border p-2 min-h-[60px] bg-gray-50">
                    {certificateData.remarks}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <div className="border-b border-dashed w-64 mx-auto mt-8 mb-2"></div>
                  <p className="text-center">Doctor's Signature & Stamp</p>
                </div>
                <div>
                  <div className="border-b border-dashed w-64 mx-auto mt-8 mb-2"></div>
                  <p className="text-center">
                    Hospital Authority Signature & Stamp
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  This is an official medical certificate of birth issued by the
                  hospital.
                </p>
                <p>
                  Certificate issued on: {format(new Date(), "MMMM dd, yyyy")}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BirthCertificate;
