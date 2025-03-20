import React, { useState, useEffect } from "react";
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
  Shield,
  Eye,
  EyeOff,
  Mail,
  Upload,
  Check,
  X,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserManagementProps {
  className?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role:
    | "admin"
    | "doctor"
    | "nurse"
    | "receptionist"
    | "lab_technician"
    | "pharmacist";
  department?: string;
  status: "active" | "inactive" | "pending";
  lastActive?: string;
  avatar?: string;
  firstCheckupFee?: number;
  secondCheckupFee?: number;
}

const UserManagement = ({ className = "" }: UserManagementProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "staff" | "admin">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  const [selectedAvatarType, setSelectedAvatarType] = useState<
    "random" | "upload"
  >("random");
  const [gender, setGender] = useState<"any" | "male" | "female">("any");
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([
    {
      id: "user-001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@hims.com",
      role: "doctor",
      department: "Cardiology",
      status: "active",
      lastActive: "2 hours ago",
      avatar: "",
    },
    {
      id: "user-002",
      name: "Dr. Michael Chen",
      email: "michael.chen@hims.com",
      role: "doctor",
      department: "Neurology",
      status: "active",
      lastActive: "1 day ago",
      avatar: "",
    },
    {
      id: "user-003",
      name: "Nurse Emily Davis",
      email: "emily.davis@hims.com",
      role: "nurse",
      department: "Emergency",
      status: "active",
      lastActive: "3 hours ago",
      avatar: "",
    },
    {
      id: "user-004",
      name: "John Smith",
      email: "john.smith@hims.com",
      role: "admin",
      status: "active",
      lastActive: "Just now",
      avatar: "",
    },
    {
      id: "user-005",
      name: "Lisa Thompson",
      email: "lisa.thompson@hims.com",
      role: "receptionist",
      status: "active",
      lastActive: "5 hours ago",
      avatar: "",
    },
    {
      id: "user-006",
      name: "Robert Wilson",
      email: "robert.wilson@hims.com",
      role: "lab_technician",
      department: "Pathology",
      status: "inactive",
      lastActive: "2 weeks ago",
      avatar: "",
    },
    {
      id: "user-007",
      name: "Jennifer Lopez",
      email: "jennifer.lopez@hims.com",
      role: "pharmacist",
      status: "pending",
      avatar: "",
    },
  ]);

  // New user form state
  const [newUser, setNewUser] = useState<Omit<User, "id" | "lastActive">>({
    name: "",
    email: "",
    password: "",
    role: "doctor",
    department: "",
    status: "active",
    avatar: "",
    firstCheckupFee: 0,
    secondCheckupFee: 0,
  });

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [generateRandomPassword, setGenerateRandomPassword] = useState(false);

  // Filter users based on tab and search query
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department &&
        user.department.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === "admin" && user.role !== "admin") return false;
    if (activeTab === "staff" && user.role === "admin") return false;

    return matchesSearch;
  });

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "default";
      case "doctor":
        return "secondary";
      case "nurse":
        return "outline";
      case "receptionist":
        return "outline";
      case "lab_technician":
        return "outline";
      case "pharmacist":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  // Function to generate a random avatar
  const generateRandomAvatar = (gender = "") => {
    const randomId = Math.floor(Math.random() * 1000);
    const selectedGender = gender || (Math.random() > 0.5 ? "male" : "female");

    // Professional avatar styles
    const styles = [
      // DiceBear Avataaars - professional style
      () => {
        const hairTypes =
          selectedGender === "male"
            ? "short,shortCurly,shortFlat,shortRound,shortWaved,sides,caesar,caesarSidePart"
            : "long,longBob,longCurly,longCurved,longStraight,longBun,longBangs";

        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedGender}${randomId}&backgroundColor=b6e3f4,c0aede,d1d4f9&hairColor=000000,6c4545,744a1d,a55728,b58143,d6b370&skinColor=f8d25c,edb98a,fd9841,ffdbac&clothesColor=3c4f5c,65c9ff,5199e4,25557c,929598&top=${hairTypes}&accessoriesChance=20&accessories=prescription01,prescription02,round&clothes=blazer,blazerAndShirt,collarAndSweater,shirt,shirtCrewNeck&style=circle`;
      },
      // DiceBear Micah - minimalist professional
      () =>
        `https://api.dicebear.com/7.x/micah/svg?seed=${selectedGender}${randomId}`,
      // DiceBear Personas - professional
      () =>
        `https://api.dicebear.com/7.x/personas/svg?seed=${selectedGender}${randomId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      // DiceBear Bottts - tech style
      () =>
        `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedGender}${randomId}`,
    ];

    // Select a random style
    const styleIndex = Math.floor(Math.random() * styles.length);
    return styles[styleIndex]();
  };

  // Generate a set of avatar options
  const regenerateAvatars = () => {
    const selectedGender = gender === "any" ? "" : gender;
    const newAvatars = Array.from({ length: 6 }).map(() =>
      generateRandomAvatar(selectedGender),
    );
    setAvatarOptions(newAvatars);
  };

  // Initialize avatars when dialog opens or gender changes
  useEffect(() => {
    if (isAvatarCreatorOpen && selectedAvatarType === "random") {
      regenerateAvatars();
    }
  }, [isAvatarCreatorOpen, selectedAvatarType, gender]);

  // Handle avatar selection
  const handleAvatarSelection = () => {
    // If no avatar is selected yet but we have options, select the first one
    if (
      selectedAvatarType === "random" &&
      !newUser.avatar &&
      avatarOptions.length > 0
    ) {
      setNewUser({
        ...newUser,
        avatar: avatarOptions[0],
      });
    }
    setIsAvatarCreatorOpen(false);
  };

  const handleAddUser = () => {
    // Generate a new ID
    const newId = `user-${String(users.length + 1).padStart(3, "0")}`;

    // If random password is checked, ensure we have a password
    let finalPassword = newUser.password;
    if (generateRandomPassword && !finalPassword) {
      finalPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).toUpperCase().slice(-2) +
        Math.floor(Math.random() * 10) +
        "!";
    }

    // Create the new user object
    const userToAdd: User = {
      ...newUser,
      password: finalPassword,
      id: newId,
      lastActive: "Just now",
    };

    // In a real app, we would send an email with login credentials here
    if (generateRandomPassword) {
      console.log(
        `Email would be sent to ${userToAdd.email} with password: ${userToAdd.password}`,
      );
      // Show toast notification
      // toast({
      //   title: "User created successfully",
      //   description: `Login credentials have been sent to ${userToAdd.email}`,
      // });
    }

    // Add the new user to the users array
    setUsers([...users, userToAdd]);

    // Reset the form
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "doctor",
      department: "",
      status: "active",
      avatar: "",
      firstCheckupFee: 0,
      secondCheckupFee: 0,
    });

    // Reset password options
    setShowPassword(false);
    setGenerateRandomPassword(false);

    // Close the dialog
    setIsAddUserDialogOpen(false);
  };

  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <Dialog
            open={isAddUserDialogOpen}
            onOpenChange={setIsAddUserDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new user to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={newUser.avatar || ""}
                        alt="Profile picture"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {newUser.name
                          ? newUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background border-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            // Open avatar creator dialog
                            setIsAvatarCreatorOpen(true);
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Choose Avatar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // Create a file input element
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";

                            // Handle file selection
                            input.onchange = (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setNewUser({
                                    ...newUser,
                                    avatar: event.target?.result as string,
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            };

                            // Trigger file selection dialog
                            input.click();
                          }}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="email@example.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <div className="col-span-3 relative">
                      <Input
                        id="password"
                        value={
                          generateRandomPassword
                            ? "[Random password will be generated]"
                            : newUser.password
                        }
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="pr-10"
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        disabled={generateRandomPassword}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-span-4 flex items-center space-x-2">
                      <Checkbox
                        id="generate-password"
                        checked={generateRandomPassword}
                        onCheckedChange={(checked) => {
                          setGenerateRandomPassword(checked === true);
                          if (checked) {
                            // Generate a random password when checkbox is checked
                            const randomPassword =
                              Math.random().toString(36).slice(-10) +
                              Math.random()
                                .toString(36)
                                .toUpperCase()
                                .slice(-2) +
                              Math.floor(Math.random() * 10) +
                              "!";
                            setNewUser({
                              ...newUser,
                              password: randomPassword,
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor="generate-password"
                        className="text-sm font-normal"
                      >
                        Generate random password and send to user's email
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: value as User["role"] })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="receptionist">
                          Receptionist
                        </SelectItem>
                        <SelectItem value="lab_technician">
                          Lab Technician
                        </SelectItem>
                        <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value) =>
                        setNewUser({
                          ...newUser,
                          status: value as User["status"],
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {newUser.role === "doctor" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">
                          Department
                        </Label>
                        <Select
                          value={newUser.department || ""}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, department: value })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cardiology">
                              Cardiology
                            </SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                            <SelectItem value="orthopedics">
                              Orthopedics
                            </SelectItem>
                            <SelectItem value="pediatrics">
                              Pediatrics
                            </SelectItem>
                            <SelectItem value="gynecology">
                              Gynecology
                            </SelectItem>
                            <SelectItem value="dermatology">
                              Dermatology
                            </SelectItem>
                            <SelectItem value="ophthalmology">
                              Ophthalmology
                            </SelectItem>
                            <SelectItem value="ent">ENT</SelectItem>
                            <SelectItem value="psychiatry">
                              Psychiatry
                            </SelectItem>
                            <SelectItem value="general_medicine">
                              General Medicine
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="firstCheckupFee" className="text-right">
                          1st Checkup Fee
                        </Label>
                        <Input
                          id="firstCheckupFee"
                          type="number"
                          value={newUser.firstCheckupFee?.toString() || "0"}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              firstCheckupFee: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="col-span-3"
                          placeholder="First checkup fee"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="secondCheckupFee"
                          className="text-right"
                        >
                          2nd Checkup Fee
                        </Label>
                        <Input
                          id="secondCheckupFee"
                          type="number"
                          value={newUser.secondCheckupFee?.toString() || "0"}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              secondCheckupFee: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="col-span-3"
                          placeholder="Second checkup fee"
                        />
                      </div>
                    </div>
                  </>
                )}
                {newUser.role !== "doctor" && newUser.role !== "admin" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={newUser.department || ""}
                        onChange={(e) =>
                          setNewUser({ ...newUser, department: e.target.value })
                        }
                        className="col-span-3"
                        placeholder="Department (optional)"
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex justify-between sm:justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddUserDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleAddUser}
                  disabled={
                    !newUser.name ||
                    !newUser.email ||
                    (!generateRandomPassword && !newUser.password)
                  }
                >
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all departments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active in the system
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting account activation
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Administrators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === "admin").length}
              </div>
              <p className="text-xs text-muted-foreground">
                With system-wide access
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, role, or department..."
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
                    <h4 className="font-medium leading-none">Filter Users</h4>
                    <p className="text-sm text-muted-foreground">
                      Filter users by various criteria
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="role-filter">Role</Label>
                      <Select
                        onValueChange={(value) =>
                          setSearchQuery(value !== "all" ? value : "")
                        }
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="All roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All roles</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="receptionist">
                            Receptionist
                          </SelectItem>
                          <SelectItem value="lab_technician">
                            Lab Technician
                          </SelectItem>
                          <SelectItem value="pharmacist">Pharmacist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                          <SelectItem value="pending">Pending</SelectItem>
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
                      <Label htmlFor="last-active-filter">Last Active</Label>
                      <Select
                        onValueChange={(value) =>
                          setSearchQuery(value !== "all" ? value : "")
                        }
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="Any time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This week</SelectItem>
                          <SelectItem value="month">This month</SelectItem>
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
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="admin">Administrators</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <UserTable users={filteredUsers} />
            </TabsContent>

            <TabsContent value="staff" className="mt-4">
              <UserTable users={filteredUsers} />
            </TabsContent>

            <TabsContent value="admin" className="mt-4">
              <UserTable users={filteredUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Avatar Creator Dialog */}
      <Dialog open={isAvatarCreatorOpen} onOpenChange={setIsAvatarCreatorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
            <DialogDescription>
              Select an avatar type or upload your own image.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="random-avatar"
                  name="avatar-type"
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  checked={selectedAvatarType === "random"}
                  onChange={() => setSelectedAvatarType("random")}
                />
                <Label htmlFor="random-avatar">Random Avatar</Label>
              </div>

              {selectedAvatarType === "random" && (
                <div className="pl-6 space-y-4 mt-2">
                  <div className="flex items-center space-x-4 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`px-4 ${!gender || gender === "any" ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => setGender("any")}
                    >
                      Any
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`px-4 ${gender === "male" ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => setGender("male")}
                    >
                      Male
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`px-4 ${gender === "female" ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => setGender("female")}
                    >
                      Female
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={regenerateAvatars}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {avatarOptions.map((avatarUrl, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border-2 rounded-md p-2 hover:border-primary transition-colors ${newUser.avatar === avatarUrl ? "border-primary" : "border-gray-200"}`}
                        onClick={() => {
                          setNewUser({
                            ...newUser,
                            avatar: avatarUrl,
                          });
                        }}
                      >
                        <Avatar className="h-16 w-16 mx-auto">
                          <AvatarImage
                            src={avatarUrl}
                            alt={`Random avatar ${index + 1}`}
                          />
                          <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="upload-avatar"
                  name="avatar-type"
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  checked={selectedAvatarType === "upload"}
                  onChange={() => setSelectedAvatarType("upload")}
                />
                <Label htmlFor="upload-avatar">Upload Your Photo</Label>
              </div>

              {selectedAvatarType === "upload" && (
                <div className="pl-6 mt-2">
                  <label htmlFor="avatar-upload" className="block">
                    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG or GIF (max. 2MB)
                      </p>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewUser({
                                ...newUser,
                                avatar: event.target?.result as string,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </label>
                </div>
              )}
            </div>

            {newUser.avatar && (
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium mb-2">Preview</p>
                <Avatar className="h-24 w-24">
                  <AvatarImage src={newUser.avatar} alt="Selected avatar" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {newUser.name
                      ? newUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAvatarCreatorOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAvatarSelection}
              disabled={!newUser.avatar}
            >
              Apply Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUserForm, setEditUserForm] = useState<
    Omit<User, "id" | "lastActive">
  >({} as any);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "default";
      case "doctor":
        return "secondary";
      case "nurse":
        return "outline";
      case "receptionist":
        return "outline";
      case "lab_technician":
        return "outline";
      case "pharmacist":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department || "",
      status: user.status,
      avatar: user.avatar || "",
      firstCheckupFee: user.firstCheckupFee || 0,
      secondCheckupFee: user.secondCheckupFee || 0,
    });
    setIsEditUserDialogOpen(true);
  };

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    // Set default permissions based on role
    const defaultPermissions: Record<User["role"], string[]> = {
      admin: [
        "view_all",
        "edit_all",
        "delete_all",
        "manage_users",
        "manage_roles",
        "view_reports",
        "manage_billing",
        "manage_settings",
        "manage_modules",
      ],
      doctor: [
        "view_patients",
        "edit_patients",
        "view_appointments",
        "manage_appointments",
        "view_medical_records",
        "edit_medical_records",
        "view_lab_results",
      ],
      nurse: [
        "view_patients",
        "edit_patients",
        "view_appointments",
        "view_medical_records",
        "edit_medical_records",
        "view_lab_results",
      ],
      receptionist: [
        "view_patients",
        "edit_patients",
        "view_appointments",
        "manage_appointments",
        "view_billing",
      ],
      lab_technician: [
        "view_patients",
        "view_lab_orders",
        "manage_lab_results",
        "view_medical_records",
      ],
      pharmacist: [
        "view_patients",
        "view_prescriptions",
        "manage_medications",
        "view_inventory",
        "manage_inventory",
      ],
    };

    setUserPermissions(defaultPermissions[user.role]);
    setIsPermissionsDialogOpen(true);
  };

  const handleSendPasswordReset = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  const saveEditedUser = () => {
    if (!selectedUser) return;

    // Update the user in the users array
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          ...editUserForm,
          // Only update password if it was changed
          password: editUserForm.password
            ? editUserForm.password
            : user.password,
        };
      }
      return user;
    });

    // In a real app, we would send this to an API
    console.log("Updated user:", editUserForm);

    // Close the dialog
    setIsEditUserDialogOpen(false);
    setSelectedUser(null);

    // Show a success message (in a real app)
    alert("User updated successfully");
  };

  const saveUserPermissions = () => {
    if (!selectedUser) return;

    // In a real app, we would send this to an API
    console.log(
      "Updated permissions for user:",
      selectedUser.name,
      userPermissions,
    );

    // Close the dialog
    setIsPermissionsDialogOpen(false);
    setSelectedUser(null);

    // Show a success message (in a real app)
    alert("User permissions updated successfully");
  };

  const sendPasswordResetEmail = () => {
    if (!selectedUser) return;

    // In a real app, we would send this to an API
    console.log("Sending password reset email to:", selectedUser.email);

    // Close the dialog
    setIsResetPasswordDialogOpen(false);
    setSelectedUser(null);

    // Show a success message (in a real app)
    alert(`Password reset email sent to ${selectedUser.email}`);
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) return;

    // Filter out the user from the users array
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);

    // In a real app, we would send this to an API
    console.log("Deleted user:", selectedUser.name);

    // Close the dialog
    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);

    // Show a success message (in a real app)
    alert(`User ${selectedUser.name} has been deleted`);
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          No users found matching your criteria.
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
                  User
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Role
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Department
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Last Active
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      className="capitalize"
                    >
                      {formatRole(user.role)}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{user.department || "-"}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={getStatusBadgeVariant(user.status)}
                      className="capitalize"
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {user.lastActive || "Never"}
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleManagePermissions(user)}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSendPasswordReset(user)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Password Reset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={editUserForm.avatar || ""}
                      alt="Profile picture"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {editUserForm.name
                        ? editUserForm.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editUserForm.name}
                    onChange={(e) =>
                      setEditUserForm({ ...editUserForm, name: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Full name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    value={editUserForm.email}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        email: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="email@example.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-password" className="text-right">
                    Password
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="edit-password"
                      value={editUserForm.password}
                      onChange={(e) =>
                        setEditUserForm({
                          ...editUserForm,
                          password: e.target.value,
                        })
                      }
                      className="pr-10"
                      placeholder="Leave blank to keep current password"
                      type={showEditPassword ? "text" : "password"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                    >
                      {showEditPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showEditPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editUserForm.status}
                    onValueChange={(value) =>
                      setEditUserForm({
                        ...editUserForm,
                        status: value as User["status"],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={editUserForm.role}
                    onValueChange={(value) =>
                      setEditUserForm({
                        ...editUserForm,
                        role: value as User["role"],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="lab_technician">
                        Lab Technician
                      </SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editUserForm.role === "doctor" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-department" className="text-right">
                      Department
                    </Label>
                    <Select
                      value={editUserForm.department || ""}
                      onValueChange={(value) =>
                        setEditUserForm({ ...editUserForm, department: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="gynecology">Gynecology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
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
                )}
                {editUserForm.role !== "doctor" &&
                  editUserForm.role !== "admin" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-department" className="text-right">
                        Department
                      </Label>
                      <Input
                        id="edit-department"
                        value={editUserForm.department || ""}
                        onChange={(e) =>
                          setEditUserForm({
                            ...editUserForm,
                            department: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Department (optional)"
                      />
                    </div>
                  )}
              </div>

              {editUserForm.role === "doctor" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="edit-firstCheckupFee"
                      className="text-right"
                    >
                      1st Checkup Fee
                    </Label>
                    <Input
                      id="edit-firstCheckupFee"
                      type="number"
                      value={editUserForm.firstCheckupFee?.toString() || "0"}
                      onChange={(e) =>
                        setEditUserForm({
                          ...editUserForm,
                          firstCheckupFee: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="col-span-3"
                      placeholder="First checkup fee"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="edit-secondCheckupFee"
                      className="text-right"
                    >
                      2nd Checkup Fee
                    </Label>
                    <Input
                      id="edit-secondCheckupFee"
                      type="number"
                      value={editUserForm.secondCheckupFee?.toString() || "0"}
                      onChange={(e) =>
                        setEditUserForm({
                          ...editUserForm,
                          secondCheckupFee: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="col-span-3"
                      placeholder="Second checkup fee"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={saveEditedUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Dialog */}
      <Dialog
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              Set permissions for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatRole(selectedUser.role)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Module Access</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-dashboard"
                      checked={userPermissions.includes("view_all")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([...userPermissions, "view_all"]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter((p) => p !== "view_all"),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-dashboard">Dashboard Access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-patients"
                      checked={userPermissions.includes("view_patients")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "view_patients",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter(
                              (p) => p !== "view_patients",
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-patients">Patient Records</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-appointments"
                      checked={userPermissions.includes("view_appointments")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "view_appointments",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter(
                              (p) => p !== "view_appointments",
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-appointments">Appointments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-billing"
                      checked={userPermissions.includes("view_billing")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "view_billing",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter((p) => p !== "view_billing"),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-billing">Billing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-lab"
                      checked={userPermissions.includes("view_lab_results")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "view_lab_results",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter(
                              (p) => p !== "view_lab_results",
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-lab">Laboratory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-pharmacy"
                      checked={userPermissions.includes("view_prescriptions")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "view_prescriptions",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter(
                              (p) => p !== "view_prescriptions",
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-pharmacy">Pharmacy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-inventory"
                      checked={userPermissions.includes("view_inventory")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "view_inventory",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter(
                              (p) => p !== "view_inventory",
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-inventory">Inventory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-reports"
                      checked={userPermissions.includes("view_reports")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "view_reports",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter((p) => p !== "view_reports"),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-reports">Reports</Label>
                  </div>
                </div>

                <h3 className="text-sm font-medium mt-6">
                  Administrative Permissions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-manage-users"
                      checked={userPermissions.includes("manage_users")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "manage_users",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter((p) => p !== "manage_users"),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-manage-users">Manage Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-manage-roles"
                      checked={userPermissions.includes("manage_roles")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "manage_roles",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter((p) => p !== "manage_roles"),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-manage-roles">Manage Roles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-manage-settings"
                      checked={userPermissions.includes("manage_settings")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "manage_settings",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter(
                              (p) => p !== "manage_settings",
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-manage-settings">
                      Manage Settings
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perm-manage-modules"
                      checked={userPermissions.includes("manage_modules")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserPermissions([
                            ...userPermissions,
                            "manage_modules",
                          ]);
                        } else {
                          setUserPermissions(
                            userPermissions.filter(
                              (p) => p !== "manage_modules",
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor="perm-manage-modules">Manage Modules</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPermissionsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={saveUserPermissions}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Password Reset</DialogTitle>
            <DialogDescription>
              Send a password reset email to {selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <Mail className="h-12 w-12 text-primary" />
              <p>A password reset link will be sent to:</p>
              <p className="font-medium">{selectedUser.email}</p>
              <p className="text-sm text-muted-foreground">
                The user will be able to set a new password by clicking the link
                in the email.
              </p>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={sendPasswordResetEmail}>
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <Trash2 className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-lg">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Role: {formatRole(selectedUser.role)}
                </p>
              </div>
              <p className="text-sm text-destructive">
                This will permanently delete the user account and all associated
                data.
              </p>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={confirmDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
