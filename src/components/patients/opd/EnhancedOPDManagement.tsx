import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import OPDVisitList from "./OPDVisitList";
import NewOPDVisit from "./NewOPDVisit";
import { OPDVisit } from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface OPDManagementProps {
  searchQuery: string;
}

const EnhancedOPDManagement: React.FC<OPDManagementProps> = ({
  searchQuery,
}) => {
  const [isNewVisitOpen, setIsNewVisitOpen] = useState<boolean>(false);
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [visits, setVisits] = useState<OPDVisit[]>([]); // This will be populated from API
  const [filteredVisits, setFilteredVisits] = useState<OPDVisit[]>([]);

  // Filter state
  const [filters, setFilters] = useState({
    visitType: "all",
    department: "all",
    status: "all",
    paymentStatus: "all",
    dateRange: {
      start: "",
      end: "",
    },
  });

  // Sample departments for filter
  const departments = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "ENT",
    "Pediatrics",
    "Gynecology",
    "Neurology",
    "Ophthalmology",
    "Psychiatry",
  ];

  // Handle new OPD visit creation
  const handleNewVisitSuccess = (newVisit: OPDVisit) => {
    setVisits([newVisit, ...visits]);
    setIsNewVisitOpen(false);
  };

  // Apply filters and search
  useEffect(() => {
    let result = visits;

    // Apply search query
    if (localSearchQuery) {
      const searchLower = localSearchQuery.toLowerCase();
      result = result.filter((visit) => {
        return (
          visit.patientName.toLowerCase().includes(searchLower) ||
          visit.mrNumber.toLowerCase().includes(searchLower) ||
          visit.doctorName.toLowerCase().includes(searchLower) ||
          visit.department.toLowerCase().includes(searchLower) ||
          (visit.diagnosis &&
            visit.diagnosis.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply visit type filter
    if (filters.visitType !== "all") {
      result = result.filter((visit) => visit.visitType === filters.visitType);
    }

    // Apply department filter
    if (filters.department !== "all") {
      result = result.filter(
        (visit) => visit.department === filters.department,
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter((visit) => visit.status === filters.status);
    }

    // Apply payment status filter
    if (filters.paymentStatus !== "all") {
      result = result.filter(
        (visit) => visit.paymentStatus === filters.paymentStatus,
      );
    }

    // Apply date range filter
    if (filters.dateRange.start) {
      result = result.filter(
        (visit) =>
          new Date(visit.visitDate) >= new Date(filters.dateRange.start),
      );
    }
    if (filters.dateRange.end) {
      result = result.filter(
        (visit) => new Date(visit.visitDate) <= new Date(filters.dateRange.end),
      );
    }

    setFilteredVisits(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [localSearchQuery, filters, visits]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisits = filteredVisits.slice(indexOfFirstItem, indexOfLastItem);

  const resetFilters = () => {
    setFilters({
      visitType: "all",
      department: "all",
      status: "all",
      paymentStatus: "all",
      dateRange: {
        start: "",
        end: "",
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">OPD Management</h2>
          <p className="text-muted-foreground">
            Manage outpatient visits and appointments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsNewVisitOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New OPD Visit
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-950">
        <div className="p-4 flex justify-between items-center">
          <div className="relative w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, doctors, departments..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter OPD Visits</h3>

                  <div className="space-y-2">
                    <Label>Visit Type</Label>
                    <Select
                      value={filters.visitType}
                      onValueChange={(value) =>
                        setFilters({ ...filters, visitType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Visit Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Visit Types</SelectItem>
                        <SelectItem value="First">First Visit</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={filters.department}
                      onValueChange={(value) =>
                        setFilters({ ...filters, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        setFilters({ ...filters, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Waiting">Waiting</SelectItem>
                        <SelectItem value="In Consultation">
                          In Consultation
                        </SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Select
                      value={filters.paymentStatus}
                      onValueChange={(value) =>
                        setFilters({ ...filters, paymentStatus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Payment Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All Payment Statuses
                        </SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Waived">Waived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="startDate"
                          className="text-xs text-muted-foreground"
                        >
                          From
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={filters.dateRange.start}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              dateRange: {
                                ...filters.dateRange,
                                start: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="endDate"
                          className="text-xs text-muted-foreground"
                        >
                          To
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={filters.dateRange.end}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              dateRange: {
                                ...filters.dateRange,
                                end: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <OPDVisitList searchQuery={localSearchQuery} />

        {/* Pagination */}
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredVisits.length)} of{" "}
            {filteredVisits.length} visits
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="5 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* New OPD Visit Dialog */}
      <NewOPDVisit
        isOpen={isNewVisitOpen}
        onClose={() => setIsNewVisitOpen(false)}
        onSuccess={handleNewVisitSuccess}
      />
    </div>
  );
};

export default EnhancedOPDManagement;
