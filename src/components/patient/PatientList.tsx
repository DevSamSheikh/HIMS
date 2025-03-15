import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Edit, MoreVertical, ChevronUp, ChevronDown } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contactNumber: string;
  lastVisit: string;
  status: "Active" | "Inactive" | "Pending";
}

interface PatientListProps {
  patients?: Patient[];
  onViewPatient?: (patientId: string) => void;
  onEditPatient?: (patientId: string) => void;
}

const PatientList = ({
  patients = [
    {
      id: "1",
      name: "John Doe",
      age: 45,
      gender: "Male",
      contactNumber: "(555) 123-4567",
      lastVisit: "2023-05-15",
      status: "Active",
    },
    {
      id: "2",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      contactNumber: "(555) 987-6543",
      lastVisit: "2023-06-22",
      status: "Active",
    },
    {
      id: "3",
      name: "Robert Johnson",
      age: 58,
      gender: "Male",
      contactNumber: "(555) 456-7890",
      lastVisit: "2023-04-10",
      status: "Inactive",
    },
    {
      id: "4",
      name: "Emily Davis",
      age: 27,
      gender: "Female",
      contactNumber: "(555) 234-5678",
      lastVisit: "2023-07-05",
      status: "Active",
    },
    {
      id: "5",
      name: "Michael Wilson",
      age: 41,
      gender: "Male",
      contactNumber: "(555) 876-5432",
      lastVisit: "2023-03-18",
      status: "Pending",
    },
  ],
  onViewPatient = (id) => console.log(`View patient ${id}`),
  onEditPatient = (id) => console.log(`Edit patient ${id}`),
}: PatientListProps) => {
  const [sortField, setSortField] = useState<keyof Patient>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  // Sort patients based on current sort field and direction
  const sortedPatients = [...patients].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Get current patients for pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = sortedPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient,
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle sort
  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: keyof Patient) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Get status color
  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patient List</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">Add New Patient</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer flex items-center"
                onClick={() => handleSort("name")}
              >
                <span>Patient Name</span>
                {renderSortIndicator("name")}
              </TableHead>
              <TableHead
                className="cursor-pointer flex items-center"
                onClick={() => handleSort("age")}
              >
                <span>Age</span>
                {renderSortIndicator("age")}
              </TableHead>
              <TableHead
                className="cursor-pointer flex items-center"
                onClick={() => handleSort("gender")}
              >
                <span>Gender</span>
                {renderSortIndicator("gender")}
              </TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead
                className="cursor-pointer flex items-center"
                onClick={() => handleSort("lastVisit")}
              >
                <span>Last Visit</span>
                {renderSortIndicator("lastVisit")}
              </TableHead>
              <TableHead
                className="cursor-pointer flex items-center"
                onClick={() => handleSort("status")}
              >
                <span>Status</span>
                {renderSortIndicator("status")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.contactNumber}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(patient.status)}`}
                  >
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onViewPatient(patient.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEditPatient(patient.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({
              length: Math.ceil(patients.length / patientsPerPage),
            }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  paginate(
                    Math.min(
                      Math.ceil(patients.length / patientsPerPage),
                      currentPage + 1,
                    ),
                  )
                }
                className={
                  currentPage === Math.ceil(patients.length / patientsPerPage)
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PatientList;
