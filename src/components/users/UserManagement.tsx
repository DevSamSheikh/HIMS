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
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface UserManagementProps {
  className?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
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
}

const UserManagement = ({ className = "" }: UserManagementProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "staff" | "admin">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock users data
  const users: User[] = [
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
  ];

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

  return (
    <div
      className={`w-full h-full bg-gray-50 dark:bg-gray-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
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
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
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
    </div>
  );
};

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
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
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Manage Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
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
  );
};

export default UserManagement;
