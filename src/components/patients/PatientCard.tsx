import React, { useRef, useEffect } from "react";
import { Patient } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Printer, RotateCw, User } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PatientCardProps {
  patient: Patient;
  onClose: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClose }) => {
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const [showFront, setShowFront] = React.useState(true);

  // Log patient data for debugging
  useEffect(() => {
    console.log("Patient data in card:", patient);
  }, [patient]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const calculateAge = () => {
    if (patient.dateOfBirth) {
      const birthDate = new Date(patient.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return `${age} years`;
    }

    return `${patient.age} ${patient.ageUnit}`;
  };

  const handlePrint = async () => {
    if (!frontCardRef.current || !backCardRef.current) return;

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85, 55], // Standard credit card size
      });

      // Capture front of card
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3, // Higher scale for better quality
        backgroundColor: null,
      });
      const frontImgData = frontCanvas.toDataURL("image/png");

      // Capture back of card
      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 3,
        backgroundColor: null,
      });
      const backImgData = backCanvas.toDataURL("image/png");

      // Add front image to PDF
      pdf.addImage(frontImgData, "PNG", 0, 0, 85, 55);

      // Add new page for back of card
      pdf.addPage();

      // Add back image to PDF
      pdf.addImage(backImgData, "PNG", 0, 0, 85, 55);

      // Save the PDF
      pdf.save(`${patient.name.replace(/ /g, "_")}_card.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  const patientData = JSON.stringify({
    id: patient.id,
    mrNumber: patient.mrNumber,
    name: patient.name,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative w-[340px] h-[220px] perspective">
          <div
            className={`absolute w-full h-full transition-all duration-500 transform-style-3d ${showFront ? "" : "rotate-y-180"}`}
          >
            {/* Front of card */}
            <div
              ref={frontCardRef}
              className="absolute w-full h-full backface-hidden bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-xl overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    Healthcare Hospital
                  </h2>
                  <p className="text-xs opacity-80">
                    Patient Identification Card
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className="bg-white text-blue-800 mb-1">
                    {patient.mrNumber}
                  </Badge>
                  <p className="text-xs opacity-80">
                    Issue Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-3">
                <div>
                  <Avatar className="h-16 w-16 border-2 border-white/50">
                    {patient.profileImage ? (
                      <AvatarImage
                        src={patient.profileImage}
                        alt={patient.name}
                      />
                    ) : (
                      <AvatarFallback className="bg-blue-700 text-xl">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{patient.name}</h3>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                    <div className="text-xs">
                      <span className="opacity-80">Age/Gender:</span>{" "}
                      <span className="font-medium">
                        {calculateAge()} / {patient.gender}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="opacity-80">Blood Group:</span>{" "}
                      <span className="font-medium">{patient.bloodGroup}</span>
                    </div>
                    {patient.cnic && (
                      <div className="text-xs col-span-2">
                        <span className="opacity-80">CNIC:</span>{" "}
                        <span className="font-medium">{patient.cnic}</span>
                      </div>
                    )}
                    <div className="text-xs col-span-2">
                      <span className="opacity-80">Address:</span>{" "}
                      <span
                        className="font-medium whitespace-nowrap overflow-hidden text-ellipsis block"
                        style={{ maxWidth: "180px" }}
                      >
                        {patient.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 right-6 text-xs opacity-80">
                <p>123 Medical Center Road, City</p>
                <p>Phone: (123) 456-7890</p>
              </div>
            </div>

            {/* Back of card */}
            <div
              ref={backCardRef}
              className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl p-6 shadow-xl flex flex-col items-center justify-between"
            >
              <div className="text-center mb-1">
                <h3 className="text-lg font-bold text-blue-800">
                  Healthcare Hospital
                </h3>
                <p className="text-xs text-gray-600">
                  Scan QR code for patient information
                </p>
              </div>

              <div className="flex items-center justify-center mt-1 mb-0">
                <div className="p-2 bg-white rounded-lg">
                  <QRCodeSVG
                    value={patientData}
                    size={90}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="w-full text-center text-xs text-gray-600 mt-1">
                <p className="mb-1">
                  This card is the property of Healthcare Hospital
                </p>
                <p>If found, please return to the nearest branch</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setShowFront(!showFront)}
          className="flex items-center gap-2"
        >
          <RotateCw className="h-4 w-4" />
          {showFront ? "Show Back" : "Show Front"}
        </Button>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Card
        </Button>
      </div>
    </div>
  );
};

export default PatientCard;
