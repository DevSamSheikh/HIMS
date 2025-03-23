import React, { useState, useEffect } from "react";
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
import {
  FileText,
  Printer,
  Download,
  Search,
  UserPlus,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock patient data for demonstration purposes
const mockPatients = [
  {
    id: "P001",
    name: "John Doe",
    mrNumber: "MR12345",
    gender: "male",
    age: "45",
    dateOfBirth: "1978-05-15",
  },
  {
    id: "P002",
    name: "Jane Smith",
    mrNumber: "MR67890",
    gender: "female",
    age: "62",
    dateOfBirth: "1961-11-23",
  },
  {
    id: "P003",
    name: "Robert Johnson",
    mrNumber: "MR54321",
    gender: "male",
    age: "78",
    dateOfBirth: "1945-03-08",
  },
];

const DeathCertificate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState("mrNumber"); // "mrNumber" or "name"
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [certificateData, setCertificateData] = useState({
    patientName: "",
    patientId: "",
    mrNumber: "",
    gender: "",
    age: "",
    dateOfBirth: "",
    dateOfDeath: format(new Date(), "yyyy-MM-dd"),
    timeOfDeath: format(new Date(), "HH:mm"),
    placeOfDeath: "Hospital",
    causeOfDeath: "",
    contributingFactors: "",
    certifiedBy: "",
    certifierDesignation: "",
    certifierRegistrationNo: "",
    relationship: "",
    informantName: "",
    informantContact: "",
    remarks: "",
  });

  // Search for patients based on MR number or name
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // In a real application, this would be an API call
    // For now, we'll filter the mock data
    const results = mockPatients.filter((patient) => {
      if (searchMode === "mrNumber") {
        return patient.mrNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      } else {
        return patient.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
    });

    setSearchResults(results);
  };

  // Handle patient selection from search results
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setCertificateData((prev) => ({
      ...prev,
      patientName: patient.name,
      patientId: patient.id,
      mrNumber: patient.mrNumber,
      gender: patient.gender,
      age: patient.age,
      dateOfBirth: patient.dateOfBirth,
    }));
    setIsSearching(false);
  };

  // Switch to manual entry mode
  const handleManualEntry = () => {
    setShowManualEntry(true);
    setIsSearching(false);
    setSelectedPatient(null);
    // Reset patient-specific fields
    setCertificateData((prev) => ({
      ...prev,
      patientName: "",
      patientId: "",
      mrNumber: "",
      gender: "",
      age: "",
      dateOfBirth: "",
    }));
  };

  // Return to search mode
  const handleBackToSearch = () => {
    setIsSearching(true);
    setShowManualEntry(false);
    setSelectedPatient(null);
  };

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

  // Effect to run search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    }
  }, [searchQuery, searchMode]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Death Certificate</h1>
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

      {isSearching ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="searchMode">Search By</Label>
                  <Select
                    value={searchMode}
                    onValueChange={(value) => setSearchMode(value)}
                  >
                    <SelectTrigger id="searchMode">
                      <SelectValue placeholder="Select search mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mrNumber">MR Number</SelectItem>
                      <SelectItem value="name">Patient Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-[3]">
                  <Label htmlFor="searchQuery">
                    {searchMode === "mrNumber" ? "MR Number" : "Patient Name"}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="searchQuery"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        searchMode === "mrNumber"
                          ? "Enter MR number"
                          : "Enter patient name"
                      }
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} type="button">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              {searchResults.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2">MR Number</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Gender</th>
                        <th className="text-left p-2">Age</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((patient) => (
                        <tr key={patient.id} className="border-t">
                          <td className="p-2">{patient.mrNumber}</td>
                          <td className="p-2">{patient.name}</td>
                          <td className="p-2">
                            {patient.gender === "male" ? "Male" : "Female"}
                          </td>
                          <td className="p-2">{patient.age}</td>
                          <td className="p-2">
                            <Button
                              size="sm"
                              onClick={() => handlePatientSelect(patient)}
                              className="flex items-center gap-1"
                            >
                              <User className="h-3 w-3" />
                              Select
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : searchQuery.trim() ? (
                <Alert>
                  <AlertDescription>
                    No patients found matching your search criteria.
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleManualEntry}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Direct Death Certificate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Certificate Form</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4 mt-4">
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                onClick={handleBackToSearch}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Back to Patient Search
              </Button>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Patient Information</CardTitle>
                {selectedPatient && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    MR: {selectedPatient.mrNumber}
                  </div>
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Full Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={certificateData.patientName}
                    onChange={handleChange}
                    placeholder="Patient's full name"
                    readOnly={!!selectedPatient}
                    className={selectedPatient ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mrNumber">MR Number</Label>
                  <Input
                    id="mrNumber"
                    name="mrNumber"
                    value={certificateData.mrNumber}
                    onChange={handleChange}
                    placeholder="MR Number"
                    readOnly={!!selectedPatient}
                    className={selectedPatient ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    name="patientId"
                    value={certificateData.patientId}
                    onChange={handleChange}
                    placeholder="Patient ID"
                    readOnly={!!selectedPatient}
                    className={selectedPatient ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={certificateData.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                    disabled={!!selectedPatient}
                  >
                    <SelectTrigger
                      id="gender"
                      className={selectedPatient ? "bg-muted" : ""}
                    >
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
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    value={certificateData.age}
                    onChange={handleChange}
                    placeholder="Patient's age"
                    readOnly={!!selectedPatient}
                    className={selectedPatient ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={certificateData.dateOfBirth}
                    onChange={handleChange}
                    readOnly={!!selectedPatient}
                    className={selectedPatient ? "bg-muted" : ""}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Death Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfDeath">Date of Death</Label>
                  <Input
                    id="dateOfDeath"
                    name="dateOfDeath"
                    type="date"
                    value={certificateData.dateOfDeath}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeOfDeath">Time of Death</Label>
                  <Input
                    id="timeOfDeath"
                    name="timeOfDeath"
                    type="time"
                    value={certificateData.timeOfDeath}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placeOfDeath">Place of Death</Label>
                  <Select
                    value={certificateData.placeOfDeath}
                    onValueChange={(value) =>
                      handleSelectChange("placeOfDeath", value)
                    }
                  >
                    <SelectTrigger id="placeOfDeath">
                      <SelectValue placeholder="Select place" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="causeOfDeath">Immediate Cause of Death</Label>
                  <Textarea
                    id="causeOfDeath"
                    name="causeOfDeath"
                    value={certificateData.causeOfDeath}
                    onChange={handleChange}
                    placeholder="Primary cause of death"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="contributingFactors">
                    Contributing Factors/Underlying Conditions
                  </Label>
                  <Textarea
                    id="contributingFactors"
                    name="contributingFactors"
                    value={certificateData.contributingFactors}
                    onChange={handleChange}
                    placeholder="Other conditions contributing to death"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certification</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certifiedBy">
                    Certified By (Doctor's Name)
                  </Label>
                  <Input
                    id="certifiedBy"
                    name="certifiedBy"
                    value={certificateData.certifiedBy}
                    onChange={handleChange}
                    placeholder="Doctor's full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifierDesignation">Designation</Label>
                  <Input
                    id="certifierDesignation"
                    name="certifierDesignation"
                    value={certificateData.certifierDesignation}
                    onChange={handleChange}
                    placeholder="Doctor's designation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifierRegistrationNo">
                    Registration No.
                  </Label>
                  <Input
                    id="certifierRegistrationNo"
                    name="certifierRegistrationNo"
                    value={certificateData.certifierRegistrationNo}
                    onChange={handleChange}
                    placeholder="Medical registration number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informant Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="informantName">Informant's Name</Label>
                  <Input
                    id="informantName"
                    name="informantName"
                    value={certificateData.informantName}
                    onChange={handleChange}
                    placeholder="Name of person reporting death"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship to Deceased</Label>
                  <Input
                    id="relationship"
                    name="relationship"
                    value={certificateData.relationship}
                    onChange={handleChange}
                    placeholder="Relationship to the deceased"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="informantContact">Contact Number</Label>
                  <Input
                    id="informantContact"
                    name="informantContact"
                    value={certificateData.informantContact}
                    onChange={handleChange}
                    placeholder="Contact number"
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
                    Death Certificate
                  </h1>
                  <p className="text-muted-foreground">
                    Official Medical Certificate of Death
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                      Patient Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="font-medium w-1/3">Full Name:</span>
                        <span className="w-2/3">
                          {certificateData.patientName || "[Not Specified]"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">Patient ID:</span>
                        <span className="w-2/3">
                          {certificateData.patientId || "[Not Specified]"}
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
                        <span className="font-medium w-1/3">Age:</span>
                        <span className="w-2/3">
                          {certificateData.age || "[Not Specified]"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">
                          Date of Birth:
                        </span>
                        <span className="w-2/3">
                          {certificateData.dateOfBirth || "[Not Specified]"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                      Death Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="font-medium w-1/3">
                          Date of Death:
                        </span>
                        <span className="w-2/3">
                          {certificateData.dateOfDeath || "[Not Specified]"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">
                          Time of Death:
                        </span>
                        <span className="w-2/3">
                          {certificateData.timeOfDeath || "[Not Specified]"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">
                          Place of Death:
                        </span>
                        <span className="w-2/3">
                          {certificateData.placeOfDeath || "[Not Specified]"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                    Cause of Death
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">Immediate Cause:</p>
                      <p className="border p-2 min-h-[60px] bg-gray-50">
                        {certificateData.causeOfDeath || "[Not Specified]"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">
                        Contributing Factors/Underlying Conditions:
                      </p>
                      <p className="border p-2 min-h-[60px] bg-gray-50">
                        {certificateData.contributingFactors ||
                          "[Not Specified]"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                      Certification
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="font-medium w-1/3">Certified By:</span>
                        <span className="w-2/3">
                          {certificateData.certifiedBy || "[Not Specified]"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">Designation:</span>
                        <span className="w-2/3">
                          {certificateData.certifierDesignation ||
                            "[Not Specified]"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">
                          Registration No:
                        </span>
                        <span className="w-2/3">
                          {certificateData.certifierRegistrationNo ||
                            "[Not Specified]"}
                        </span>
                      </div>
                      <div className="mt-8 border-t pt-4">
                        <div className="border-b border-dashed w-64 mx-auto mt-8 mb-2"></div>
                        <p className="text-center">Signature & Stamp</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4 border-b pb-1">
                      Informant Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="font-medium w-1/3">Name:</span>
                        <span className="w-2/3">
                          {certificateData.informantName || "[Not Specified]"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">Relationship:</span>
                        <span className="w-2/3">
                          {certificateData.relationship || "[Not Specified]"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">Contact:</span>
                        <span className="w-2/3">
                          {certificateData.informantContact ||
                            "[Not Specified]"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

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

                <div className="mt-8 text-center text-sm text-muted-foreground">
                  <p>
                    This is an official medical certificate of death issued by
                    the hospital.
                  </p>
                  <p>
                    Certificate issued on: {format(new Date(), "MMMM dd, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

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

export default DeathCertificate;
