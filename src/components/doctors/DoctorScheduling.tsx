import React, { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  CalendarDays,
  CalendarClock,
  CalendarRange,
  ArrowLeft,
  Copy,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
  status: "active" | "inactive" | "on-leave";
  avatar?: string;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
}

interface SchedulePattern {
  id: string;
  type: "daily" | "weekly" | "specific-dates" | "custom";
  days?: string[];
  dates?: string[];
  timeSlots: TimeSlot[];
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
}

const DoctorScheduling = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [activeTab, setActiveTab] = useState("current");
  const [isAddScheduleDialogOpen, setIsAddScheduleDialogOpen] = useState(false);
  const [isEditScheduleDialogOpen, setIsEditScheduleDialogOpen] =
    useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<SchedulePattern | null>(null);

  // Sample doctor data
  const [doctor, setDoctor] = useState<Doctor>({
    id: doctorId || "doc-001",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hims.com",
    specialization: "Cardiologist",
    department: "Cardiology",
    status: "active",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=female001&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=longHair,longBob&accessories=prescription01&clothes=blazerAndShirt&style=circle",
  });

  // Sample schedule patterns
  const [schedulePatterns, setSchedulePatterns] = useState<SchedulePattern[]>([
    {
      id: "schedule-1",
      type: "daily",
      timeSlots: [
        { id: "slot-1", startTime: "09:00", endTime: "12:00", maxPatients: 15 },
        { id: "slot-2", startTime: "16:00", endTime: "19:00", maxPatients: 12 },
      ],
      effectiveFrom: "2023-06-01",
      isActive: true,
    },
    {
      id: "schedule-2",
      type: "weekly",
      days: ["monday", "wednesday", "friday"],
      timeSlots: [
        { id: "slot-3", startTime: "10:00", endTime: "13:00", maxPatients: 10 },
      ],
      effectiveFrom: "2023-07-15",
      effectiveTo: "2023-12-31",
      isActive: true,
    },
    {
      id: "schedule-3",
      type: "specific-dates",
      dates: ["2023-08-10", "2023-08-24", "2023-09-07"],
      timeSlots: [
        { id: "slot-4", startTime: "14:00", endTime: "18:00", maxPatients: 8 },
      ],
      effectiveFrom: "2023-08-10",
      effectiveTo: "2023-09-07",
      isActive: false,
    },
  ]);

  // New schedule form state
  const [newSchedule, setNewSchedule] = useState<Omit<SchedulePattern, "id">>({
    type: "daily",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    dates: [],
    timeSlots: [
      {
        id: `slot-${Date.now()}-1`,
        startTime: "09:00",
        endTime: "12:00",
        maxPatients: 10,
      },
    ],
    effectiveFrom: new Date().toISOString().split("T")[0],
    isActive: true,
  });

  // Filter schedules based on tab
  const filteredSchedules = schedulePatterns.filter((schedule) => {
    if (activeTab === "current") return schedule.isActive;
    if (activeTab === "upcoming") {
      const today = new Date();
      const effectiveFrom = new Date(schedule.effectiveFrom);
      return effectiveFrom > today && schedule.isActive;
    }
    if (activeTab === "past") {
      const today = new Date();
      const effectiveTo = schedule.effectiveTo
        ? new Date(schedule.effectiveTo)
        : null;
      return effectiveTo && effectiveTo < today;
    }
    if (activeTab === "inactive") return !schedule.isActive;
    return true;
  });

  // Add a new time slot to the schedule being created/edited
  const addTimeSlot = () => {
    if (selectedSchedule) {
      // For editing existing schedule
      const updatedSchedule = {
        ...selectedSchedule,
        timeSlots: [
          ...selectedSchedule.timeSlots,
          {
            id: `slot-${Date.now()}`,
            startTime: "09:00",
            endTime: "12:00",
            maxPatients: 10,
          },
        ],
      };
      setSelectedSchedule(updatedSchedule);
    } else {
      // For creating new schedule
      setNewSchedule({
        ...newSchedule,
        timeSlots: [
          ...newSchedule.timeSlots,
          {
            id: `slot-${Date.now()}`,
            startTime: "09:00",
            endTime: "12:00",
            maxPatients: 10,
          },
        ],
      });
    }
  };

  // Remove a time slot from the schedule being created/edited
  const removeTimeSlot = (slotId: string) => {
    if (selectedSchedule) {
      // For editing existing schedule
      const updatedSchedule = {
        ...selectedSchedule,
        timeSlots: selectedSchedule.timeSlots.filter(
          (slot) => slot.id !== slotId,
        ),
      };
      setSelectedSchedule(updatedSchedule);
    } else {
      // For creating new schedule
      setNewSchedule({
        ...newSchedule,
        timeSlots: newSchedule.timeSlots.filter((slot) => slot.id !== slotId),
      });
    }
  };

  // Update a time slot in the schedule being created/edited
  const updateTimeSlot = (
    slotId: string,
    field: keyof TimeSlot,
    value: string | number,
  ) => {
    if (selectedSchedule) {
      // For editing existing schedule
      const updatedSchedule = {
        ...selectedSchedule,
        timeSlots: selectedSchedule.timeSlots.map((slot) =>
          slot.id === slotId ? { ...slot, [field]: value } : slot,
        ),
      };
      setSelectedSchedule(updatedSchedule);
    } else {
      // For creating new schedule
      setNewSchedule({
        ...newSchedule,
        timeSlots: newSchedule.timeSlots.map((slot) =>
          slot.id === slotId ? { ...slot, [field]: value } : slot,
        ),
      });
    }
  };

  // Handle day selection for weekly schedule
  const handleDaySelection = (day: string) => {
    if (selectedSchedule) {
      // For editing existing schedule
      const currentDays = selectedSchedule.days || [];
      const updatedDays = currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day];

      setSelectedSchedule({
        ...selectedSchedule,
        days: updatedDays,
      });
    } else {
      // For creating new schedule
      const currentDays = newSchedule.days || [];
      const updatedDays = currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day];

      setNewSchedule({
        ...newSchedule,
        days: updatedDays,
      });
    }
  };

  // Handle date selection for specific-dates schedule
  const handleDateSelection = (date: string) => {
    if (selectedSchedule) {
      // For editing existing schedule
      const currentDates = selectedSchedule.dates || [];
      const updatedDates = currentDates.includes(date)
        ? currentDates.filter((d) => d !== date)
        : [...currentDates, date];

      setSelectedSchedule({
        ...selectedSchedule,
        dates: updatedDates,
      });
    } else {
      // For creating new schedule
      const currentDates = newSchedule.dates || [];
      const updatedDates = currentDates.includes(date)
        ? currentDates.filter((d) => d !== date)
        : [...currentDates, date];

      setNewSchedule({
        ...newSchedule,
        dates: updatedDates,
      });
    }
  };

  // Handle schedule type change
  const handleScheduleTypeChange = (type: SchedulePattern["type"]) => {
    if (selectedSchedule) {
      // For editing existing schedule
      setSelectedSchedule({
        ...selectedSchedule,
        type,
        // Reset days or dates based on type
        days: type === "weekly" ? ["monday", "wednesday", "friday"] : undefined,
        dates: type === "specific-dates" ? [] : undefined,
      });
    } else {
      // For creating new schedule
      setNewSchedule({
        ...newSchedule,
        type,
        // Reset days or dates based on type
        days: type === "weekly" ? ["monday", "wednesday", "friday"] : undefined,
        dates: type === "specific-dates" ? [] : undefined,
      });
    }
  };

  // Save a new schedule
  const handleSaveNewSchedule = () => {
    const newScheduleWithId: SchedulePattern = {
      ...newSchedule,
      id: `schedule-${Date.now()}`,
    };

    setSchedulePatterns([...schedulePatterns, newScheduleWithId]);
    setIsAddScheduleDialogOpen(false);

    // Reset form
    setNewSchedule({
      type: "daily",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      dates: [],
      timeSlots: [
        {
          id: `slot-${Date.now()}-1`,
          startTime: "09:00",
          endTime: "12:00",
          maxPatients: 10,
        },
      ],
      effectiveFrom: new Date().toISOString().split("T")[0],
      isActive: true,
    });
  };

  // Save edited schedule
  const handleSaveEditedSchedule = () => {
    if (!selectedSchedule) return;

    const updatedSchedules = schedulePatterns.map((schedule) =>
      schedule.id === selectedSchedule.id ? selectedSchedule : schedule,
    );

    setSchedulePatterns(updatedSchedules);
    setIsEditScheduleDialogOpen(false);
    setSelectedSchedule(null);
  };

  // Toggle schedule active status
  const toggleScheduleStatus = (scheduleId: string) => {
    const updatedSchedules = schedulePatterns.map((schedule) =>
      schedule.id === scheduleId
        ? { ...schedule, isActive: !schedule.isActive }
        : schedule,
    );

    setSchedulePatterns(updatedSchedules);
  };

  // Delete a schedule
  const deleteSchedule = (scheduleId: string) => {
    const updatedSchedules = schedulePatterns.filter(
      (schedule) => schedule.id !== scheduleId,
    );
    setSchedulePatterns(updatedSchedules);
  };

  // Edit a schedule
  const editSchedule = (schedule: SchedulePattern) => {
    setSelectedSchedule(schedule);
    setIsEditScheduleDialogOpen(true);
  };

  // Format schedule type for display
  const formatScheduleType = (type: SchedulePattern["type"]) => {
    switch (type) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "specific-dates":
        return "Specific Dates";
      case "custom":
        return "Custom";
      default:
        return type;
    }
  };

  // Format days for display
  const formatDays = (days: string[] | undefined) => {
    if (!days || days.length === 0) return "N/A";

    if (days.length === 7) return "Every day";

    const dayMap: Record<string, string> = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };

    return days.map((day) => dayMap[day] || day).join(", ");
  };

  // Format dates for display
  const formatDates = (dates: string[] | undefined) => {
    if (!dates || dates.length === 0) return "N/A";

    if (dates.length > 3) {
      return `${dates.length} dates selected`;
    }

    return dates
      .map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      })
      .join(", ");
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/doctors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Doctors
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Doctor Scheduling
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

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Schedule Patterns</h2>
          <Dialog
            open={isAddScheduleDialogOpen}
            onOpenChange={setIsAddScheduleDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Schedule Pattern
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Add New Schedule Pattern</DialogTitle>
                <DialogDescription>
                  Create a new schedule pattern for {doctor.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="schedule-type" className="text-right">
                    Schedule Type
                  </Label>
                  <Select
                    value={newSchedule.type}
                    onValueChange={(value) =>
                      handleScheduleTypeChange(value as SchedulePattern["type"])
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select schedule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="specific-dates">
                        Specific Dates
                      </SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newSchedule.type === "weekly" && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Days of Week</Label>
                    <div className="col-span-3 flex flex-wrap gap-2">
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => (
                        <Button
                          key={day}
                          type="button"
                          variant={
                            newSchedule.days?.includes(day)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleDaySelection(day)}
                          className="capitalize"
                        >
                          {day.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {newSchedule.type === "specific-dates" && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Specific Dates</Label>
                    <div className="col-span-3">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newSchedule.dates && newSchedule.dates.length > 0 ? (
                          newSchedule.dates.map((date) => (
                            <Badge
                              key={date}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {new Date(date).toLocaleDateString()}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => handleDateSelection(date)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No dates selected. Add dates below.
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          id="add-date"
                          min={new Date().toISOString().split("T")[0]}
                          className="w-auto"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleDateSelection(e.target.value);
                              e.target.value = ""; // Reset input after selection
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(
                              "add-date",
                            ) as HTMLInputElement;
                            if (input.value) {
                              handleDateSelection(input.value);
                              input.value = ""; // Reset input after selection
                            }
                          }}
                        >
                          Add Date
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="effective-from" className="text-right">
                    Effective From
                  </Label>
                  <Input
                    id="effective-from"
                    type="date"
                    value={newSchedule.effectiveFrom}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        effectiveFrom: e.target.value,
                      })
                    }
                    className="col-span-3"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="effective-to" className="text-right">
                    Effective To
                  </Label>
                  <Input
                    id="effective-to"
                    type="date"
                    value={newSchedule.effectiveTo || ""}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        effectiveTo: e.target.value,
                      })
                    }
                    className="col-span-3"
                    min={newSchedule.effectiveFrom}
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Time Slots</Label>
                  <div className="col-span-3 space-y-4">
                    {newSchedule.timeSlots.map((slot, index) => (
                      <div key={slot.id} className="flex items-center gap-2">
                        <div className="grid grid-cols-3 gap-2 flex-1">
                          <div>
                            <Label
                              htmlFor={`start-time-${slot.id}`}
                              className="text-xs mb-1 block"
                            >
                              Start Time
                            </Label>
                            <Input
                              id={`start-time-${slot.id}`}
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  slot.id,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`end-time-${slot.id}`}
                              className="text-xs mb-1 block"
                            >
                              End Time
                            </Label>
                            <Input
                              id={`end-time-${slot.id}`}
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  slot.id,
                                  "endTime",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`max-patients-${slot.id}`}
                              className="text-xs mb-1 block"
                            >
                              Max Patients
                            </Label>
                            <Input
                              id={`max-patients-${slot.id}`}
                              type="number"
                              min="1"
                              value={slot.maxPatients}
                              onChange={(e) =>
                                updateTimeSlot(
                                  slot.id,
                                  "maxPatients",
                                  parseInt(e.target.value),
                                )
                              }
                            />
                          </div>
                        </div>
                        {newSchedule.timeSlots.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTimeSlot(slot.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTimeSlot}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Time Slot
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is-active" className="text-right">
                    Status
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Checkbox
                      id="is-active"
                      checked={newSchedule.isActive}
                      onCheckedChange={(checked) =>
                        setNewSchedule({
                          ...newSchedule,
                          isActive: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="is-active" className="font-normal">
                      Active
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddScheduleDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveNewSchedule}>
                  Save Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs
          defaultValue="current"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4 space-y-4">
            {filteredSchedules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <CalendarClock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No current schedule patterns found.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsAddScheduleDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Schedule Pattern
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchedules.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={() => editSchedule(schedule)}
                    onToggleStatus={() => toggleScheduleStatus(schedule.id)}
                    onDelete={() => deleteSchedule(schedule.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {filteredSchedules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <CalendarRange className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No upcoming schedule patterns found.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsAddScheduleDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Schedule Pattern
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchedules.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={() => editSchedule(schedule)}
                    onToggleStatus={() => toggleScheduleStatus(schedule.id)}
                    onDelete={() => deleteSchedule(schedule.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-4">
            {filteredSchedules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No past schedule patterns found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchedules.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={() => editSchedule(schedule)}
                    onToggleStatus={() => toggleScheduleStatus(schedule.id)}
                    onDelete={() => deleteSchedule(schedule.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="mt-4 space-y-4">
            {filteredSchedules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No inactive schedule patterns found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchedules.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={() => editSchedule(schedule)}
                    onToggleStatus={() => toggleScheduleStatus(schedule.id)}
                    onDelete={() => deleteSchedule(schedule.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Schedule Dialog */}
      <Dialog
        open={isEditScheduleDialogOpen}
        onOpenChange={setIsEditScheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule Pattern</DialogTitle>
            <DialogDescription>
              Update schedule pattern for {doctor.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedSchedule && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-schedule-type" className="text-right">
                  Schedule Type
                </Label>
                <Select
                  value={selectedSchedule.type}
                  onValueChange={(value) =>
                    handleScheduleTypeChange(value as SchedulePattern["type"])
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="specific-dates">
                      Specific Dates
                    </SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedSchedule.type === "weekly" && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Days of Week</Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={
                          selectedSchedule.days?.includes(day)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleDaySelection(day)}
                        className="capitalize"
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedSchedule.type === "specific-dates" && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Specific Dates</Label>
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedSchedule.dates &&
                      selectedSchedule.dates.length > 0 ? (
                        selectedSchedule.dates.map((date) => (
                          <Badge
                            key={date}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {new Date(date).toLocaleDateString()}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => handleDateSelection(date)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No dates selected. Add dates below.
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        id="edit-add-date"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-auto"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleDateSelection(e.target.value);
                            e.target.value = ""; // Reset input after selection
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById(
                            "edit-add-date",
                          ) as HTMLInputElement;
                          if (input.value) {
                            handleDateSelection(input.value);
                            input.value = ""; // Reset input after selection
                          }
                        }}
                      >
                        Add Date
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-effective-from" className="text-right">
                  Effective From
                </Label>
                <Input
                  id="edit-effective-from"
                  type="date"
                  value={selectedSchedule.effectiveFrom}
                  onChange={(e) =>
                    setSelectedSchedule({
                      ...selectedSchedule,
                      effectiveFrom: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-effective-to" className="text-right">
                  Effective To
                </Label>
                <Input
                  id="edit-effective-to"
                  type="date"
                  value={selectedSchedule.effectiveTo || ""}
                  onChange={(e) =>
                    setSelectedSchedule({
                      ...selectedSchedule,
                      effectiveTo: e.target.value,
                    })
                  }
                  className="col-span-3"
                  min={selectedSchedule.effectiveFrom}
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Time Slots</Label>
                <div className="col-span-3 space-y-4">
                  {selectedSchedule.timeSlots.map((slot, index) => (
                    <div key={slot.id} className="flex items-center gap-2">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div>
                          <Label
                            htmlFor={`edit-start-time-${slot.id}`}
                            className="text-xs mb-1 block"
                          >
                            Start Time
                          </Label>
                          <Input
                            id={`edit-start-time-${slot.id}`}
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              updateTimeSlot(
                                slot.id,
                                "startTime",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`edit-end-time-${slot.id}`}
                            className="text-xs mb-1 block"
                          >
                            End Time
                          </Label>
                          <Input
                            id={`edit-end-time-${slot.id}`}
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              updateTimeSlot(slot.id, "endTime", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`edit-max-patients-${slot.id}`}
                            className="text-xs mb-1 block"
                          >
                            Max Patients
                          </Label>
                          <Input
                            id={`edit-max-patients-${slot.id}`}
                            type="number"
                            min="1"
                            value={slot.maxPatients}
                            onChange={(e) =>
                              updateTimeSlot(
                                slot.id,
                                "maxPatients",
                                parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                      {selectedSchedule.timeSlots.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTimeSlot(slot.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTimeSlot}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Time Slot
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-is-active" className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="edit-is-active"
                    checked={selectedSchedule.isActive}
                    onCheckedChange={(checked) =>
                      setSelectedSchedule({
                        ...selectedSchedule,
                        isActive: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="edit-is-active" className="font-normal">
                    Active
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditScheduleDialogOpen(false);
                setSelectedSchedule(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveEditedSchedule}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ScheduleCardProps {
  schedule: SchedulePattern;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const ScheduleCard = ({
  schedule,
  onEdit,
  onToggleStatus,
  onDelete,
}: ScheduleCardProps) => {
  // Format schedule type for display
  const formatScheduleType = (type: SchedulePattern["type"]) => {
    switch (type) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "specific-dates":
        return "Specific Dates";
      case "custom":
        return "Custom";
      default:
        return type;
    }
  };

  // Format days for display
  const formatDays = (days: string[] | undefined) => {
    if (!days || days.length === 0) return "N/A";

    if (days.length === 7) return "Every day";

    const dayMap: Record<string, string> = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };

    return days.map((day) => dayMap[day] || day).join(", ");
  };

  // Format dates for display
  const formatDates = (dates: string[] | undefined) => {
    if (!dates || dates.length === 0) return "N/A";

    if (dates.length > 3) {
      return `${dates.length} dates selected`;
    }

    return dates
      .map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      })
      .join(", ");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {formatScheduleType(schedule.type)} Schedule
            </CardTitle>
            <CardDescription>
              {schedule.type === "daily" && "Repeats every day"}
              {schedule.type === "weekly" &&
                `Days: ${formatDays(schedule.days)}`}
              {schedule.type === "specific-dates" &&
                `Dates: ${formatDates(schedule.dates)}`}
              {schedule.type === "custom" && "Custom schedule pattern"}
            </CardDescription>
          </div>
          <Badge variant={schedule.isActive ? "default" : "secondary"}>
            {schedule.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Effective Period:</span>
            <span>
              {new Date(schedule.effectiveFrom).toLocaleDateString()}
              {schedule.effectiveTo &&
                ` to ${new Date(schedule.effectiveTo).toLocaleDateString()}`}
            </span>
          </div>

          <div className="text-sm">
            <div className="text-muted-foreground mb-1">Time Slots:</div>
            <ScrollArea className="h-24 rounded-md border p-2">
              <div className="space-y-2">
                {schedule.timeSlots.map((slot) => (
                  <div key={slot.id} className="flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      Max: {slot.maxPatients} patients
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      <div className="p-4 pt-0 flex justify-end space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleStatus}>
                {schedule.isActive ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {schedule.isActive ? "Deactivate" : "Activate"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default DoctorScheduling;
