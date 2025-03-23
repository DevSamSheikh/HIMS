import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Eye,
  Mail,
  Clock,
  CalendarDays,
  CalendarClock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

interface DoctorManagementProps {
  className?: string;
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
  status: "active" | "inactive" | "on-leave";
  lastActive?: string;
  avatar?: string;
  firstCheckupFee?: number;
  secondCheckupFee?: number;
}

const DoctorManagement = ({ className = "" }: DoctorManagementProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "on-leave">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "doc-001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@hims.com",
      specialization: "Cardiologist",
      department: "Cardiology",
      status: "active",
      lastActive: "2 hours ago",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=female001&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=longHair,longBob&accessories=prescription01&clothes=blazerAndShirt&style=circle",
      firstCheckupFee: 1500,
      secondCheckupFee: 1000,
    },
    {
      id: "doc-002",
      name: "Dr. Michael Chen",
      email: "michael.chen@hims.com",
      specialization: "Neurologist",
      department: "Neurology",
      status: "active",
      lastActive: "1 day ago",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=male001&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=shortHair,shortFlat&accessories=prescription02&clothes=blazerAndShirt&style=circle",
      firstCheckupFee: 2000,
      secondCheckupFee: 1200,
    },
    {
      id: "doc-003",
      name: "Dr. Emily Davis",
      email: "emily.davis@hims.com",
      specialization: "Emergency Medicine",
      department: "Emergency",
      status: "active",
      lastActive: "3 hours ago",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=female002&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=longHair,longStraight&accessories=prescription01&clothes=blazerAndShirt&style=circle",
      firstCheckupFee: 1800,
      secondCheckupFee: 1000,
    },
    {
      id: "doc-004",
      name: "Dr. James Wilson",
      email: "james.wilson@hims.com",
      specialization: "Orthopedic Surgeon",
      department: "Orthopedics",
      status: "on-leave",
      lastActive: "5 days ago",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=male002&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=shortHair,shortRound&accessories=prescription02&clothes=blazerAndShirt&style=circle",
      firstCheckupFee: 2500,
      secondCheckupFee: 1500,
    },
    {
      id: "doc-005",
      name: "Dr. Lisa Thompson",
      email: "lisa.thompson@hims.com",
      specialization: "Pediatrician",
      department: "Pediatrics",
      status: "active",
      lastActive: "5 hours ago",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=female003&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=longHair,longCurly&accessories=prescription01&clothes=blazerAndShirt&style=circle",
      firstCheckupFee: 1200,
      secondCheckupFee: 800,
    },
    {
      id: "doc-006",
      name: "Dr. Robert Wilson",
      email: "robert.wilson@hims.com",
      specialization: "Pathologist",
      department: "Pathology",
      status: "inactive",
      lastActive: "2 weeks ago",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=male003&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=shortHair,shortCurly&accessories=prescription02&clothes=blazerAndShirt&style=circle",
      firstCheckupFee: 1800,
      secondCheckupFee: 1000,
    },
    {
      id: "doc-007",
      name: "Dr. Jennifer Lopez",
      email: "jennifer.lopez@hims.com",
      specialization: "Dermatologist",
      department: "Dermatology",
      status: "active",
      lastActive: "1 day ago",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=female004&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=longHair,longBangs&accessories=prescription01&clothes=blazerAndShirt&style=circle",
      firstCheckupFee: 2000,
      secondCheckupFee: 1200,
    },
  ]);

  // Filter doctors based on tab and search query
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "active" && doctor.status !== "active") return false;
    if (activeTab === "on-leave" && doctor.status !== "on-leave") return false;

    return matchesSearch;
  });

  const getStatusBadgeVariant = (status: Doctor["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "on-leave":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Doctor Management
          </h1>
          <Button asChild>
            <Link to="/doctors/scheduling">
              <Calendar className="mr-2 h-4 w-4" />
              Doctor Scheduling
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Doctors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctors.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all departments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Doctors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {doctors.filter((d) => d.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently available for appointments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {doctors.filter((d) => d.status === "on-leave").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently unavailable
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(doctors.map((d) => d.department)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                With specialized doctors
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, specialization, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filter Doctors</h4>
                    <p className="text-sm text-muted-foreground">
                      Filter doctors by various criteria
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select
                        onValueChange={(value) =>
                          setSearchQuery(value !== "all" ? value : "")
                        }
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="on-leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="department-filter">Department</Label>
                      <Select
                        onValueChange={(value) =>
                          setSearchQuery(value !== "all" ? value : "")
                        }
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="All departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All departments</SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="orthopedics">
                            Orthopedics
                          </SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="gynecology">Gynecology</SelectItem>
                          <SelectItem value="dermatology">
                            Dermatology
                          </SelectItem>
                          <SelectItem value="ophthalmology">
                            Ophthalmology
                          </SelectItem>
                          <SelectItem value="ent">ENT</SelectItem>
                          <SelectItem value="psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="general_medicine">
                            General Medicine
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="specialization-filter">
                        Specialization
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setSearchQuery(value !== "all" ? value : "")
                        }
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="All specializations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            All specializations
                          </SelectItem>
                          <SelectItem value="cardiologist">
                            Cardiologist
                          </SelectItem>
                          <SelectItem value="neurologist">
                            Neurologist
                          </SelectItem>
                          <SelectItem value="orthopedic surgeon">
                            Orthopedic Surgeon
                          </SelectItem>
                          <SelectItem value="pediatrician">
                            Pediatrician
                          </SelectItem>
                          <SelectItem value="gynecologist">
                            Gynecologist
                          </SelectItem>
                          <SelectItem value="dermatologist">
                            Dermatologist
                          </SelectItem>
                          <SelectItem value="ophthalmologist">
                            Ophthalmologist
                          </SelectItem>
                          <SelectItem value="ent specialist">
                            ENT Specialist
                          </SelectItem>
                          <SelectItem value="psychiatrist">
                            Psychiatrist
                          </SelectItem>
                          <SelectItem value="general physician">
                            General Physician
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                    >
                      Reset
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button asChild>
              <Link to="/doctors/add">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Doctor
              </Link>
            </Button>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Doctors</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="on-leave">On Leave</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <DoctorTable doctors={filteredDoctors} />
            </TabsContent>

            <TabsContent value="active" className="mt-4">
              <DoctorTable doctors={filteredDoctors} />
            </TabsContent>

            <TabsContent value="on-leave" className="mt-4">
              <DoctorTable doctors={filteredDoctors} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

interface DoctorTableProps {
  doctors: Doctor[];
}

const DoctorTable = ({ doctors }: DoctorTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getStatusBadgeVariant = (status: Doctor["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "on-leave":
        return "outline";
      default:
        return "outline";
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (doctors.length === 0) {
    return (
      <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          No doctors found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white dark:bg-gray-800">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Doctor
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Specialization
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Department
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Fees (₹)
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {doctor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{doctor.specialization}</td>
                  <td className="p-4 align-middle">{doctor.department}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={getStatusBadgeVariant(doctor.status)}
                      className="capitalize"
                    >
                      {doctor.status.replace("-", " ")}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="text-sm">
                      <div>First: ₹{doctor.firstCheckupFee}</div>
                      <div>Follow-up: ₹{doctor.secondCheckupFee}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/doctors/view/${doctor.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/doctors/edit/${doctor.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Doctor
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/doctors/scheduling/${doctor.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Manage Schedule
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Doctor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default DoctorManagement;
