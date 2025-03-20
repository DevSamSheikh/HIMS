import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  ClipboardList,
  BedDouble,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { Patient } from "./types";

interface PatientListProps {
  searchQuery: string;
}

const PatientList: React.FC<PatientListProps> = ({ searchQuery }) => {
  // Sample patient data
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      mrNumber: "MR-2023-0001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      contact: "+92 300 1234567",
      address: "123 Main St, Karachi",
      registrationDate: "2023-01-15",
      patientType: ["OPD", "IPD"],
      lastVisit: "2023-06-20",
      bloodGroup: "O+",
    },
    {
      id: "2",
      mrNumber: "MR-2023-0002",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      contact: "+92 321 9876543",
      address: "456 Park Ave, Lahore",
      registrationDate: "2023-02-10",
      patientType: ["OPD"],
      lastVisit: "2023-07-05",
      bloodGroup: "A+",
    },
    {
      id: "3",
      mrNumber: "MR-2023-0003",
      name: "Ahmed Khan",
      age: 60,
      gender: "Male",
      contact: "+92 333 5556666",
      address: "789 Hospital Road, Islamabad",
      registrationDate: "2023-03-22",
      patientType: ["IPD"],
      lastVisit: "2023-05-18",
      bloodGroup: "B-",
    },
    {
      id: "4",
      mrNumber: "MR-2023-0004",
      name: "Fatima Ali",
      age: 28,
      gender: "Female",
      contact: "+92 345 1112222",
      address: "101 Green Town, Faisalabad",
      registrationDate: "2023-04-05",
      patientType: ["OPD", "IPD"],
      lastVisit: "2023-07-10",
      bloodGroup: "AB+",
    },
    {
      id: "5",
      mrNumber: "MR-2023-0005",
      name: "Mohammad Raza",
      age: 52,
      gender: "Male",
      contact: "+92 312 3334444",
      address: "222 Blue Area, Peshawar",
      registrationDate: "2023-05-17",
      patientType: ["OPD"],
      lastVisit: "2023-06-30",
      bloodGroup: "O-",
    },
  ]);

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.mrNumber.toLowerCase().includes(searchLower) ||
      patient.contact.toLowerCase().includes(searchLower)
    );
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>MR Number</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No patients found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Reg:{" "}
                          {new Date(
                            patient.registrationDate,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {patient.mrNumber}
                  </TableCell>
                  <TableCell>
                    {patient.age} / {patient.gender}
                  </TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {patient.patientType.includes("OPD") && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          OPD
                        </Badge>
                      )}
                      {patient.patientType.includes("IPD") && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          IPD
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {patient.bloodGroup}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ClipboardList className="mr-2 h-4 w-4" />
                          New OPD Visit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BedDouble className="mr-2 h-4 w-4" />
                          New IPD Admission
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Medical History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default PatientList;
