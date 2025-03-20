import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  appointmentDate: Date;
  appointmentTime: string;
  purpose: string;
  doctorId: string;
  doctorName: string;
  department: string;
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | "No Show";
  notes?: string;
}

interface NewAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
}

const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00 AM");
  const [patient, setPatient] = useState("");
  const [mrNumber, setMrNumber] = useState("");
  const [doctor, setDoctor] = useState("");
  const [department, setDepartment] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

  // Sample patients for dropdown
  const patients = [
    { id: "1", name: "John Smith", mrNumber: "MR-2023-0001" },
    { id: "2", name: "Sarah Johnson", mrNumber: "MR-2023-0002" },
    { id: "3", name: "Ahmed Khan", mrNumber: "MR-2023-0003" },
    { id: "4", name: "Fatima Ali", mrNumber: "MR-2023-0004" },
    { id: "5", name: "Mohammad Raza", mrNumber: "MR-2023-0005" },
  ];

  // Sample doctors for dropdown
  const doctors = [
    { id: "D1", name: "Dr. Ahmed Khan", department: "Cardiology" },
    { id: "D2", name: "Dr. Fatima Ali", department: "Dermatology" },
    { id: "D3", name: "Dr. Zainab Malik", department: "Orthopedics" },
    { id: "D4", name: "Dr. Imran Shah", department: "ENT" },
    { id: "D5", name: "Dr. Saima Nawaz", department: "General Medicine" },
  ];

  const handlePatientChange = (patientId: string) => {
    setPatient(patientId);
    const selectedPatient = patients.find((p) => p.id === patientId);
    if (selectedPatient) {
      setMrNumber(selectedPatient.mrNumber);
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    setDoctor(doctorId);
    const selectedDoctor = doctors.find((d) => d.id === doctorId);
    if (selectedDoctor) {
      setDepartment(selectedDoctor.department);
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!patient || !doctor || !date || !time || !purpose) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedPatient = patients.find((p) => p.id === patient);
    const selectedDoctor = doctors.find((d) => d.id === doctor);

    if (!selectedPatient || !selectedDoctor) {
      toast({
        title: "Invalid selection",
        description: "Please select a valid patient and doctor.",
        variant: "destructive",
      });
      return;
    }

    const newAppointment: Appointment = {
      id: `A${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      mrNumber: selectedPatient.mrNumber,
      appointmentDate: date,
      appointmentTime: time,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      purpose: purpose,
      status: "Scheduled",
      notes: notes,
    };

    onSave(newAppointment);
    resetForm();
  };

  const resetForm = () => {
    setDate(new Date());
    setTime("09:00 AM");
    setPatient("");
    setMrNumber("");
    setDoctor("");
    setDepartment("");
    setPurpose("");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a new appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={patient} onValueChange={handlePatientChange}>
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.mrNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>MR Number</Label>
              <Input value={mrNumber} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select value={doctor} onValueChange={handleDoctorChange}>
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={department} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Appointment Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="09:30 AM">9:30 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="02:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="02:30 PM">2:30 PM</SelectItem>
                  <SelectItem value="03:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="03:30 PM">3:30 PM</SelectItem>
                  <SelectItem value="04:00 PM">4:00 PM</SelectItem>
                  <SelectItem value="04:30 PM">4:30 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="E.g., Consultation, Follow-up, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Schedule Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentDialog;
