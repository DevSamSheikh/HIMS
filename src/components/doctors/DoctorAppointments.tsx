import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Info,
  MoreHorizontal,
  Search,
  User,
  FileText,
  AlertCircle,
  CalendarDays,
  CalendarClock,
  Stethoscope,
  ClipboardList,
  MessageCircle,
  Phone,
  Mail,
  Pill,
  Eye,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DoctorAppointmentsProps {
  className?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  patientAvatar?: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  type: "first-visit" | "follow-up" | "emergency" | "consultation";
  chiefComplaint: string;
  vitalSigns?: {
    bloodPressure?: string;
    temperature?: string;
    pulse?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
  notes?: string;
  medicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
  contactNumber?: string;
  email?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

const DoctorAppointments = ({ className = "" }: DoctorAppointmentsProps) => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isAppointmentDetailsOpen, setIsAppointmentDetailsOpen] =
    useState(false);

  // Sample doctor data
  const doctor = {
    id: doctorId || "doc-001",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    department: "Cardiology",
    status: "active",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=female001&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=longHair,longBob&accessories=prescription01&clothes=blazerAndShirt&style=circle",
  };

  // Sample appointments data
  const appointments: Appointment[] = [
    {
      id: "apt-001",
      patientId: "pat-001",
      patientName: "John Smith",
      patientAge: 45,
      patientGender: "male",
      patientAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=John&style=circle",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      duration: 30,
      status: "scheduled",
      type: "follow-up",
      chiefComplaint: "Chest pain and shortness of breath",
      vitalSigns: {
        bloodPressure: "140/90 mmHg",
        temperature: "98.6°F",
        pulse: "88 bpm",
        respiratoryRate: "18/min",
        oxygenSaturation: "96%",
      },
      notes:
        "Patient reports intermittent chest pain, worse with exertion. Has been taking prescribed medication regularly.",
      medicalHistory: ["Hypertension", "Type 2 Diabetes", "Hyperlipidemia"],
      medications: [
        "Lisinopril 10mg daily",
        "Metformin 500mg twice daily",
        "Atorvastatin 20mg daily",
      ],
      allergies: ["Penicillin"],
      contactNumber: "+91 98765 43210",
      email: "john.smith@example.com",
    },
    {
      id: "apt-002",
      patientId: "pat-002",
      patientName: "Emily Johnson",
      patientAge: 32,
      patientGender: "female",
      patientAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&style=circle",
      date: new Date().toISOString().split("T")[0],
      time: "10:30",
      duration: 45,
      status: "scheduled",
      type: "first-visit",
      chiefComplaint: "Palpitations and dizziness",
      vitalSigns: {
        bloodPressure: "125/80 mmHg",
        temperature: "98.2°F",
        pulse: "95 bpm",
        respiratoryRate: "16/min",
        oxygenSaturation: "98%",
      },
      notes:
        "Patient reports episodes of rapid heartbeat and dizziness, especially when standing up quickly.",
      medicalHistory: ["Anxiety", "Migraine"],
      medications: ["Propranolol 20mg as needed", "Sumatriptan 50mg as needed"],
      allergies: ["Sulfa drugs"],
      contactNumber: "+91 98765 12345",
      email: "emily.johnson@example.com",
    },
    {
      id: "apt-003",
      patientId: "pat-003",
      patientName: "Michael Chen",
      patientAge: 58,
      patientGender: "male",
      patientAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&style=circle",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      duration: 30,
      status: "scheduled",
      type: "follow-up",
      chiefComplaint: "Follow-up after cardiac catheterization",
      vitalSigns: {
        bloodPressure: "135/85 mmHg",
        temperature: "98.4°F",
        pulse: "72 bpm",
        respiratoryRate: "17/min",
        oxygenSaturation: "97%",
      },
      notes:
        "Post-procedure follow-up. Patient reports feeling better with less chest pain. Incision site healing well.",
      medicalHistory: [
        "Coronary Artery Disease",
        "Hypertension",
        "Hyperlipidemia",
      ],
      medications: [
        "Aspirin 81mg daily",
        "Metoprolol 25mg twice daily",
        "Atorvastatin 40mg daily",
        "Clopidogrel 75mg daily",
      ],
      allergies: ["None"],
      contactNumber: "+91 98765 67890",
      email: "michael.chen@example.com",
    },
    {
      id: "apt-004",
      patientId: "pat-004",
      patientName: "Sarah Williams",
      patientAge: 29,
      patientGender: "female",
      patientAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&style=circle",
      date: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
      time: "09:30",
      duration: 30,
      status: "scheduled",
      type: "follow-up",
      chiefComplaint: "Heart palpitations during pregnancy",
      vitalSigns: {
        bloodPressure: "120/75 mmHg",
        temperature: "98.8°F",
        pulse: "85 bpm",
        respiratoryRate: "18/min",
        oxygenSaturation: "99%",
      },
      notes:
        "28 weeks pregnant. Experiencing occasional palpitations, especially when lying down. No syncope or chest pain.",
      medicalHistory: ["Pregnancy - 28 weeks", "Mitral Valve Prolapse"],
      medications: ["Prenatal vitamins"],
      allergies: ["Latex"],
      contactNumber: "+91 98765 23456",
      email: "sarah.williams@example.com",
    },
    {
      id: "apt-005",
      patientId: "pat-005",
      patientName: "Robert Davis",
      patientAge: 62,
      patientGender: "male",
      patientAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&style=circle",
      date: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
      time: "11:00",
      duration: 45,
      status: "scheduled",
      type: "follow-up",
      chiefComplaint: "Post-MI follow-up",
      vitalSigns: {
        bloodPressure: "130/80 mmHg",
        temperature: "98.6°F",
        pulse: "68 bpm",
        respiratoryRate: "16/min",
        oxygenSaturation: "96%",
      },
      notes:
        "3 months post-MI. Completed cardiac rehabilitation. Reports improved exercise tolerance. Compliant with medications.",
      medicalHistory: [
        "Myocardial Infarction (3 months ago)",
        "Hypertension",
        "Type 2 Diabetes",
      ],
      medications: [
        "Aspirin 81mg daily",
        "Metoprolol 50mg twice daily",
        "Lisinopril 20mg daily",
        "Atorvastatin 80mg daily",
        "Metformin 1000mg twice daily",
      ],
      allergies: ["Codeine"],
      contactNumber: "+91 98765 34567",
      email: "robert.davis@example.com",
    },
  ];

  // Generate calendar days for the current month view
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Total days in the month
    const daysInMonth = lastDay.getDate();

    // Calculate days from previous month to show
    const prevMonthDays = firstDayOfWeek;

    // Calculate days from next month to show (to complete the grid)
    const nextMonthDays = 42 - (prevMonthDays + daysInMonth); // 42 = 6 rows * 7 days

    const calendarDays: CalendarDay[] = [];

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthLastDay = prevMonth.getDate();

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        appointments: appointments.filter((apt) =>
          isSameDay(new Date(apt.date), date),
        ),
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        appointments: appointments.filter((apt) =>
          isSameDay(new Date(apt.date), date),
        ),
      });
    }

    // Add days from next month
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        appointments: appointments.filter((apt) =>
          isSameDay(new Date(apt.date), date),
        ),
      });
    }

    return calendarDays;
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Generate week view days
  const generateWeekDays = (): CalendarDay[] => {
    const weekDays: CalendarDay[] = [];
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push({
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday: isSameDay(date, new Date()),
        appointments: appointments.filter((apt) =>
          isSameDay(new Date(apt.date), date),
        ),
      });
    }

    return weekDays;
  };

  // Get appointments for the selected date
  const getDayAppointments = (): Appointment[] => {
    if (!selectedDate) return [];

    return appointments.filter((apt) =>
      isSameDay(new Date(apt.date), selectedDate),
    );
  };

  // Filter appointments based on search query and filters
  const filterAppointments = (appointments: Appointment[]): Appointment[] => {
    return appointments.filter((apt) => {
      const matchesSearch =
        searchQuery === "" ||
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || apt.status === statusFilter;
      const matchesType = typeFilter === "all" || apt.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  };

  // Navigate to previous month/week/day
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
    if (viewMode === "day") {
      setSelectedDate(newDate);
    }
  };

  // Navigate to next month/week/day
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    if (viewMode === "day") {
      setSelectedDate(newDate);
    }
  };

  // Navigate to today
  const navigateToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Format week range for display
  const formatWeekRange = (days: CalendarDay[]): string => {
    if (days.length === 0) return "";
    const firstDay = days[0].date;
    const lastDay = days[days.length - 1].date;

    const firstMonth = firstDay.toLocaleDateString("en-US", { month: "short" });
    const lastMonth = lastDay.toLocaleDateString("en-US", { month: "short" });

    if (firstMonth === lastMonth) {
      return `${firstMonth} ${firstDay.getDate()} - ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
    } else {
      return `${firstMonth} ${firstDay.getDate()} - ${lastMonth} ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
    }
  };

  // Format day for display
  const formatDay = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      case "no-show":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Get appointment type badge variant
  const getTypeBadgeVariant = (type: Appointment["type"]) => {
    switch (type) {
      case "first-visit":
        return "default";
      case "follow-up":
        return "secondary";
      case "emergency":
        return "destructive";
      case "consultation":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Format appointment time
  const formatAppointmentTime = (time: string, duration: number): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Format appointment type for display
  const formatAppointmentType = (type: Appointment["type"]) => {
    switch (type) {
      case "first-visit":
        return "First Visit";
      case "follow-up":
        return "Follow-up";
      case "emergency":
        return "Emergency";
      case "consultation":
        return "Consultation";
      default:
        return type;
    }
  };

  // Format appointment status for display
  const formatAppointmentStatus = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "no-show":
        return "No Show";
      default:
        return status;
    }
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailsOpen(true);
  };

  // Calendar days for the current view
  const calendarDays =
    viewMode === "month" ? generateCalendarDays() : generateWeekDays();

  // Appointments for the selected date (day view)
  const dayAppointments = getDayAppointments();
  const filteredDayAppointments = filterAppointments(dayAppointments);

  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/doctors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Doctors
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Doctor Appointments
          </h1>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription>
                  {doctor.specialization} • {doctor.department}
                </CardDescription>
              </div>
              <Badge
                variant={doctor.status === "active" ? "default" : "outline"}
                className="ml-auto capitalize"
              >
                {doctor.status.replace("-", " ")}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={navigateToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold ml-2">
                {viewMode === "month" && formatDate(currentDate)}
                {viewMode === "week" && formatWeekRange(calendarDays)}
                {viewMode === "day" && formatDay(currentDate)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Tabs
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as "month" | "week" | "day")
                }
                className="w-auto"
              >
                <TabsList className="grid w-[300px] grid-cols-3">
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name or chief complaint..."
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
                    <h4 className="font-medium leading-none">
                      Filter Appointments
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Filter appointments by status and type
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no-show">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="type-filter">Type</Label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All types</SelectItem>
                          <SelectItem value="first-visit">
                            First Visit
                          </SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="consultation">
                            Consultation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusFilter("all");
                        setTypeFilter("all");
                      }}
                    >
                      Reset
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Month View */}
          {viewMode === "month" && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className="text-center font-medium py-2">
                        {day}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const filteredAppointments = filterAppointments(
                      day.appointments,
                    );
                    return (
                      <div
                        key={index}
                        className={`min-h-[100px] p-1 border rounded-md ${day.isCurrentMonth ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"} ${day.isToday ? "border-primary" : "border-gray-200 dark:border-gray-700"} ${isSameDay(day.date, selectedDate || new Date()) ? "ring-2 ring-primary ring-offset-2" : ""}`}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-sm font-medium ${day.isToday ? "text-primary" : ""}`}
                          >
                            {day.date.getDate()}
                          </span>
                          {day.appointments.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {day.appointments.length}
                            </Badge>
                          )}
                        </div>
                        <ScrollArea className="h-[70px]">
                          <div className="space-y-1">
                            {filteredAppointments.slice(0, 3).map((apt) => (
                              <div
                                key={apt.id}
                                className={`text-xs p-1 rounded-sm cursor-pointer ${apt.status === "cancelled" ? "line-through" : ""}`}
                                style={{
                                  backgroundColor:
                                    apt.type === "emergency"
                                      ? "rgba(239, 68, 68, 0.1)"
                                      : apt.type === "first-visit"
                                        ? "rgba(59, 130, 246, 0.1)"
                                        : "rgba(107, 114, 128, 0.1)",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAppointmentClick(apt);
                                }}
                              >
                                <div className="font-medium truncate">
                                  {apt.time} - {apt.patientName}
                                </div>
                              </div>
                            ))}
                            {filteredAppointments.length > 3 && (
                              <div className="text-xs text-center text-muted-foreground">
                                +{filteredAppointments.length - 3} more
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Week View */}
          {viewMode === "week" && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`border rounded-md ${day.isToday ? "border-primary" : "border-gray-200 dark:border-gray-700"} ${isSameDay(day.date, selectedDate || new Date()) ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div
                        className={`text-center py-2 font-medium ${day.isToday ? "bg-primary text-primary-foreground" : "bg-gray-100 dark:bg-gray-800"} rounded-t-md`}
                      >
                        <div>
                          {day.date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-lg">{day.date.getDate()}</div>
                      </div>
                      <ScrollArea className="h-[300px] p-2">
                        <div className="space-y-2">
                          {filterAppointments(day.appointments).map((apt) => (
                            <div
                              key={apt.id}
                              className={`p-2 rounded-md cursor-pointer border-l-4 ${apt.status === "cancelled" ? "line-through" : ""}`}
                              style={{
                                borderLeftColor:
                                  apt.type === "emergency"
                                    ? "rgb(239, 68, 68)"
                                    : apt.type === "first-visit"
                                      ? "rgb(59, 130, 246)"
                                      : "rgb(107, 114, 128)",
                                backgroundColor:
                                  apt.type === "emergency"
                                    ? "rgba(239, 68, 68, 0.1)"
                                    : apt.type === "first-visit"
                                      ? "rgba(59, 130, 246, 0.1)"
                                      : "rgba(107, 114, 128, 0.1)",
                              }}
                              onClick={() => handleAppointmentClick(apt)}
                            >
                              <div className="font-medium">{apt.time}</div>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage
                                    src={apt.patientAvatar}
                                    alt={apt.patientName}
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {apt.patientName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm truncate">
                                  {apt.patientName}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {apt.chiefComplaint}
                              </div>
                            </div>
                          ))}
                          {day.appointments.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-4">
                              No appointments
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Day View */}
          {viewMode === "day" && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Appointments for {formatDay(currentDate)}
                    </h3>
                    <Badge variant="outline">
                      {filteredDayAppointments.length} appointments
                    </Badge>
                  </div>
                  {filteredDayAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No appointments scheduled for this day.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredDayAppointments.map((apt) => (
                        <Card key={apt.id} className="overflow-hidden">
                          <div
                            className={`h-1 w-full ${apt.type === "emergency" ? "bg-destructive" : apt.type === "first-visit" ? "bg-primary" : "bg-secondary"}`}
                          />
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={apt.patientAvatar}
                                    alt={apt.patientName}
                                  />
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {apt.patientName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {apt.patientName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {apt.patientAge} years •{" "}
                                    {apt.patientGender.charAt(0).toUpperCase() +
                                      apt.patientGender.slice(1)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant={getStatusBadgeVariant(apt.status)}
                                >
                                  {formatAppointmentStatus(apt.status)}
                                </Badge>
                                <Badge variant={getTypeBadgeVariant(apt.type)}>
                                  {formatAppointmentType(apt.type)}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <Clock className="h-3 w-3" />
                                  {formatAppointmentTime(
                                    apt.time,
                                    apt.duration,
                                  )}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                                  <AlertCircle className="h-4 w-4 text-destructive" />
                                  Chief Complaint
                                </h4>
                                <p className="text-sm">{apt.chiefComplaint}</p>
                              </div>
                              {apt.vitalSigns && (
                                <div>
                                  <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                                    <Activity className="h-4 w-4 text-primary" />
                                    Vital Signs
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    {apt.vitalSigns.bloodPressure && (
                                      <div>
                                        BP: {apt.vitalSigns.bloodPressure}
                                      </div>
                                    )}
                                    {apt.vitalSigns.temperature && (
                                      <div>
                                        Temp: {apt.vitalSigns.temperature}
                                      </div>
                                    )}
                                    {apt.vitalSigns.pulse && (
                                      <div>Pulse: {apt.vitalSigns.pulse}</div>
                                    )}
                                    {apt.vitalSigns.respiratoryRate && (
                                      <div>
                                        Resp: {apt.vitalSigns.respiratoryRate}
                                      </div>
                                    )}
                                    {apt.vitalSigns.oxygenSaturation && (
                                      <div>
                                        O₂ Sat:{" "}
                                        {apt.vitalSigns.oxygenSaturation}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAppointmentClick(apt)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog
        open={isAppointmentDetailsOpen}
        onOpenChange={setIsAppointmentDetailsOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  {formatDay(new Date(selectedAppointment.date))} •{" "}
                  {formatAppointmentTime(
                    selectedAppointment.time,
                    selectedAppointment.duration,
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedAppointment.patientAvatar}
                      alt={selectedAppointment.patientName}
                    />
                    <AvatarFallback className="text-xl">
                      {selectedAppointment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedAppointment.patientName}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedAppointment.patientAge} years •{" "}
                      {selectedAppointment.patientGender
                        .charAt(0)
                        .toUpperCase() +
                        selectedAppointment.patientGender.slice(1)}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {selectedAppointment.contactNumber && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{selectedAppointment.contactNumber}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {selectedAppointment.email && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{selectedAppointment.email}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col gap-2 items-end">
                    <Badge
                      variant={getStatusBadgeVariant(
                        selectedAppointment.status,
                      )}
                      className="mb-1"
                    >
                      {formatAppointmentStatus(selectedAppointment.status)}
                    </Badge>
                    <Badge
                      variant={getTypeBadgeVariant(selectedAppointment.type)}
                    >
                      {formatAppointmentType(selectedAppointment.type)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        Chief Complaint
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{selectedAppointment.chiefComplaint}</p>
                    </CardContent>
                  </Card>

                  {selectedAppointment.vitalSigns && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          Vital Signs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedAppointment.vitalSigns.bloodPressure && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">BP:</span>
                              <span>
                                {selectedAppointment.vitalSigns.bloodPressure}
                              </span>
                            </div>
                          )}
                          {selectedAppointment.vitalSigns.temperature && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Temp:</span>
                              <span>
                                {selectedAppointment.vitalSigns.temperature}
                              </span>
                            </div>
                          )}
                          {selectedAppointment.vitalSigns.pulse && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Pulse:
                              </span>
                              <span>
                                {selectedAppointment.vitalSigns.pulse}
                              </span>
                            </div>
                          )}
                          {selectedAppointment.vitalSigns.respiratoryRate && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Resp:</span>
                              <span>
                                {selectedAppointment.vitalSigns.respiratoryRate}
                              </span>
                            </div>
                          )}
                          {selectedAppointment.vitalSigns.oxygenSaturation && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                O₂ Sat:
                              </span>
                              <span>
                                {
                                  selectedAppointment.vitalSigns
                                    .oxygenSaturation
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedAppointment.medicalHistory &&
                    selectedAppointment.medicalHistory.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-secondary" />
                            Medical History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedAppointment.medicalHistory.map(
                              (item, index) => (
                                <li key={index} className="text-sm">
                                  {item}
                                </li>
                              ),
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                  {selectedAppointment.medications &&
                    selectedAppointment.medications.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Pill className="h-4 w-4 text-secondary" />
                            Medications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedAppointment.medications.map(
                              (item, index) => (
                                <li key={index} className="text-sm">
                                  {item}
                                </li>
                              ),
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                  {selectedAppointment.allergies &&
                    selectedAppointment.allergies.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            Allergies
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedAppointment.allergies.map(
                              (item, index) => (
                                <li key={index} className="text-sm">
                                  {item}
                                </li>
                              ),
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                </div>

                {selectedAppointment.notes && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedAppointment.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAppointmentDetailsOpen(false)}
                >
                  Close
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      Actions <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Appointment Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Start Consultation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <X className="mr-2 h-4 w-4" />
                      Cancel Appointment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointments;
