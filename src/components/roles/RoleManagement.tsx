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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

const RoleManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen] = useState(false);
  const [isViewUsersDialogOpen, setIsViewUsersDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<
    Omit<Role, "id" | "userCount" | "createdAt" | "updatedAt">
  >({
    name: "",
    description: "",
    permissions: [],
    isSystem: false,
  });

  // Sample permission data
  const permissions: Permission[] = [
    // Dashboard permissions
    {
      id: "view_dashboard",
      name: "View Dashboard",
      description: "Access to view the main dashboard",
      module: "Dashboard",
    },
    {
      id: "view_analytics",
      name: "View Analytics",
      description: "Access to view analytics data",
      module: "Dashboard",
    },

    // Patient permissions
    {
      id: "view_patients",
      name: "View Patients",
      description: "Access to view patient records",
      module: "Patients",
    },
    {
      id: "add_patients",
      name: "Add Patients",
      description: "Ability to add new patients",
      module: "Patients",
    },
    {
      id: "edit_patients",
      name: "Edit Patients",
      description: "Ability to edit patient information",
      module: "Patients",
    },
    {
      id: "delete_patients",
      name: "Delete Patients",
      description: "Ability to delete patient records",
      module: "Patients",
    },

    // Appointment permissions
    {
      id: "view_appointments",
      name: "View Appointments",
      description: "Access to view appointments",
      module: "Appointments",
    },
    {
      id: "add_appointments",
      name: "Add Appointments",
      description: "Ability to create new appointments",
      module: "Appointments",
    },
    {
      id: "edit_appointments",
      name: "Edit Appointments",
      description: "Ability to modify appointments",
      module: "Appointments",
    },
    {
      id: "delete_appointments",
      name: "Delete Appointments",
      description: "Ability to cancel appointments",
      module: "Appointments",
    },

    // Medical Records permissions
    {
      id: "view_medical_records",
      name: "View Medical Records",
      description: "Access to view medical records",
      module: "Medical Records",
    },
    {
      id: "add_medical_records",
      name: "Add Medical Records",
      description: "Ability to add new medical records",
      module: "Medical Records",
    },
    {
      id: "edit_medical_records",
      name: "Edit Medical Records",
      description: "Ability to modify medical records",
      module: "Medical Records",
    },

    // Billing permissions
    {
      id: "view_billing",
      name: "View Billing",
      description: "Access to view billing information",
      module: "Billing",
    },
    {
      id: "create_invoices",
      name: "Create Invoices",
      description: "Ability to create new invoices",
      module: "Billing",
    },
    {
      id: "process_payments",
      name: "Process Payments",
      description: "Ability to process payments",
      module: "Billing",
    },

    // Inventory permissions
    {
      id: "view_inventory",
      name: "View Inventory",
      description: "Access to view inventory",
      module: "Inventory",
    },
    {
      id: "manage_inventory",
      name: "Manage Inventory",
      description: "Ability to manage inventory items",
      module: "Inventory",
    },

    // Laboratory permissions
    {
      id: "view_lab_results",
      name: "View Lab Results",
      description: "Access to view laboratory results",
      module: "Laboratory",
    },
    {
      id: "add_lab_results",
      name: "Add Lab Results",
      description: "Ability to add new laboratory results",
      module: "Laboratory",
    },

    // Pharmacy permissions
    {
      id: "view_prescriptions",
      name: "View Prescriptions",
      description: "Access to view prescriptions",
      module: "Pharmacy",
    },
    {
      id: "fill_prescriptions",
      name: "Fill Prescriptions",
      description: "Ability to fill prescriptions",
      module: "Pharmacy",
    },

    // Reports permissions
    {
      id: "view_reports",
      name: "View Reports",
      description: "Access to view reports",
      module: "Reports",
    },
    {
      id: "generate_reports",
      name: "Generate Reports",
      description: "Ability to generate new reports",
      module: "Reports",
    },

    // User Management permissions
    {
      id: "view_users",
      name: "View Users",
      description: "Access to view user accounts",
      module: "User Management",
    },
    {
      id: "add_users",
      name: "Add Users",
      description: "Ability to add new users",
      module: "User Management",
    },
    {
      id: "edit_users",
      name: "Edit Users",
      description: "Ability to edit user information",
      module: "User Management",
    },
    {
      id: "delete_users",
      name: "Delete Users",
      description: "Ability to delete user accounts",
      module: "User Management",
    },

    // Role Management permissions
    {
      id: "view_roles",
      name: "View Roles",
      description: "Access to view roles",
      module: "Role Management",
    },
    {
      id: "add_roles",
      name: "Add Roles",
      description: "Ability to add new roles",
      module: "Role Management",
    },
    {
      id: "edit_roles",
      name: "Edit Roles",
      description: "Ability to edit roles",
      module: "Role Management",
    },
    {
      id: "delete_roles",
      name: "Delete Roles",
      description: "Ability to delete roles",
      module: "Role Management",
    },

    // Settings permissions
    {
      id: "view_settings",
      name: "View Settings",
      description: "Access to view system settings",
      module: "Settings",
    },
    {
      id: "edit_settings",
      name: "Edit Settings",
      description: "Ability to modify system settings",
      module: "Settings",
    },
  ];

  // Group permissions by module
  const permissionsByModule = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  // Sample role data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: permissions.map((p) => p.id),
      userCount: 3,
      isSystem: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Doctor",
      description: "Medical staff with patient care permissions",
      permissions: [
        "view_dashboard",
        "view_analytics",
        "view_patients",
        "edit_patients",
        "view_appointments",
        "add_appointments",
        "edit_appointments",
        "view_medical_records",
        "add_medical_records",
        "edit_medical_records",
        "view_lab_results",
        "view_prescriptions",
        "fill_prescriptions",
      ],
      userCount: 12,
      isSystem: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "3",
      name: "Nurse",
      description: "Nursing staff with limited patient care access",
      permissions: [
        "view_dashboard",
        "view_patients",
        "view_appointments",
        "view_medical_records",
        "add_medical_records",
        "view_lab_results",
      ],
      userCount: 25,
      isSystem: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "4",
      name: "Receptionist",
      description: "Front desk staff for appointments and billing",
      permissions: [
        "view_dashboard",
        "view_patients",
        "add_patients",
        "view_appointments",
        "add_appointments",
        "edit_appointments",
        "view_billing",
      ],
      userCount: 8,
      isSystem: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "5",
      name: "Lab Technician",
      description: "Laboratory staff for test results",
      permissions: [
        "view_dashboard",
        "view_patients",
        "view_lab_results",
        "add_lab_results",
      ],
      userCount: 6,
      isSystem: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "6",
      name: "Billing Specialist",
      description: "Finance staff for billing and payments",
      permissions: [
        "view_dashboard",
        "view_patients",
        "view_billing",
        "create_invoices",
        "process_payments",
        "view_reports",
        "generate_reports",
      ],
      userCount: 4,
      isSystem: false,
      createdAt: "2023-02-15T00:00:00Z",
      updatedAt: "2023-02-15T00:00:00Z",
    },
    {
      id: "7",
      name: "Pharmacist",
      description: "Pharmacy staff for medication management",
      permissions: [
        "view_dashboard",
        "view_patients",
        "view_prescriptions",
        "fill_prescriptions",
        "view_inventory",
        "manage_inventory",
      ],
      userCount: 5,
      isSystem: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "8",
      name: "Department Head",
      description: "Department leadership with reporting access",
      permissions: [
        "view_dashboard",
        "view_analytics",
        "view_patients",
        "view_appointments",
        "view_medical_records",
        "view_billing",
        "view_reports",
        "generate_reports",
      ],
      userCount: 3,
      isSystem: false,
      createdAt: "2023-03-10T00:00:00Z",
      updatedAt: "2023-03-10T00:00:00Z",
    },
  ]);

  // Sample users for the selected role
  const sampleUsers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      department: "Cardiology",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      department: "Pediatrics",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.c@example.com",
      department: "Neurology",
    },
    {
      id: "4",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      department: "Administration",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.w@example.com",
      department: "Pharmacy",
    },
  ];

  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddRole = () => {
    // Generate a random ID
    const id = Math.random().toString(36).substring(2, 9);

    // Create new role object
    const role: Role = {
      id,
      ...newRole,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to roles array
    setRoles([...roles, role]);

    // Reset form and close dialog
    setNewRole({
      name: "",
      description: "",
      permissions: [],
      isSystem: false,
    });
    setIsAddRoleDialogOpen(false);
  };

  const handleEditRole = () => {
    if (!selectedRole) return;

    // Update the role in the roles array
    const updatedRoles = roles.map((role) => {
      if (role.id === selectedRole.id) {
        return {
          ...role,
          name: newRole.name,
          description: newRole.description,
          permissions: newRole.permissions,
          updatedAt: new Date().toISOString(),
        };
      }
      return role;
    });

    setRoles(updatedRoles);
    setIsEditRoleDialogOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;

    // Filter out the role from the roles array
    const updatedRoles = roles.filter((role) => role.id !== selectedRole.id);
    setRoles(updatedRoles);
    setIsDeleteRoleDialogOpen(false);
    setSelectedRole(null);
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
      isSystem: role.isSystem,
    });
    setIsEditRoleDialogOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteRoleDialogOpen(true);
  };

  const handleViewUsersClick = (role: Role) => {
    setSelectedRole(role);
    setIsViewUsersDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    if (newRole.permissions.includes(permissionId)) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter((id) => id !== permissionId),
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permissionId],
      });
    }
  };

  const toggleAllModulePermissions = (
    modulePermissions: Permission[],
    checked: boolean,
  ) => {
    const permissionIds = modulePermissions.map((p) => p.id);

    if (checked) {
      // Add all permissions from this module that aren't already included
      const newPermissions = [
        ...new Set([...newRole.permissions, ...permissionIds]),
      ];
      setNewRole({
        ...newRole,
        permissions: newPermissions,
      });
    } else {
      // Remove all permissions from this module
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter(
          (id) => !permissionIds.includes(id),
        ),
      });
    }
  };

  const isAllModulePermissionsSelected = (modulePermissions: Permission[]) => {
    return modulePermissions.every((permission) =>
      newRole.permissions.includes(permission.id),
    );
  };

  const isSomeModulePermissionsSelected = (modulePermissions: Permission[]) => {
    return (
      modulePermissions.some((permission) =>
        newRole.permissions.includes(permission.id),
      ) && !isAllModulePermissionsSelected(modulePermissions)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Define and manage roles and permissions for system access.
          </p>
        </div>
        <Button onClick={() => setIsAddRoleDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No roles found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-transparent p-0"
                      onClick={() => handleViewUsersClick(role)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      {role.userCount}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {role.isSystem ? (
                      <Badge variant="secondary">System</Badge>
                    ) : (
                      <Badge variant="outline">Custom</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(role.updatedAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditClick(role)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewUsersClick(role)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          View Users
                        </DropdownMenuItem>
                        {!role.isSystem && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(role)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Role
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent
          className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions for system access.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="name" className="text-right">
                  Role Name
                </Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Enter role name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Brief description of this role"
                />
              </div>
            </div>

            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Permissions
              </h3>
              <Tabs defaultValue="grouped">
                <TabsList className="mb-3">
                  <TabsTrigger value="grouped">Grouped by Module</TabsTrigger>
                  <TabsTrigger value="all">All Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="grouped" className="space-y-4">
                  {Object.entries(permissionsByModule).map(
                    ([module, modulePermissions]) => (
                      <div key={module} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`module-${module}`}
                            checked={isAllModulePermissionsSelected(
                              modulePermissions,
                            )}
                            onCheckedChange={(checked) =>
                              toggleAllModulePermissions(
                                modulePermissions,
                                !!checked,
                              )
                            }
                            className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                            data-state={
                              isAllModulePermissionsSelected(modulePermissions)
                                ? "checked"
                                : isSomeModulePermissionsSelected(
                                      modulePermissions,
                                    )
                                  ? "indeterminate"
                                  : "unchecked"
                            }
                          />
                          <Label
                            htmlFor={`module-${module}`}
                            className="text-sm font-medium"
                          >
                            {module}
                          </Label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-6">
                          {modulePermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={newRole.permissions.includes(
                                  permission.id,
                                )}
                                onCheckedChange={() =>
                                  togglePermission(permission.id)
                                }
                              />
                              <Label
                                htmlFor={`permission-${permission.id}`}
                                className="text-sm"
                              >
                                {permission.name}
                                <span className="text-xs text-muted-foreground block">
                                  {permission.description}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </TabsContent>
                <TabsContent value="all" className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`all-permission-${permission.id}`}
                          checked={newRole.permissions.includes(permission.id)}
                          onCheckedChange={() =>
                            togglePermission(permission.id)
                          }
                        />
                        <Label
                          htmlFor={`all-permission-${permission.id}`}
                          className="text-sm"
                        >
                          {permission.name}
                          <span className="text-xs text-muted-foreground block">
                            {permission.description}
                          </span>
                          <Badge variant="outline" className="mt-1">
                            {permission.module}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddRole}>
              Add Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={isEditRoleDialogOpen}
        onOpenChange={setIsEditRoleDialogOpen}
      >
        <DialogContent
          className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Modify role details and permissions for {selectedRole?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="edit-name" className="text-right">
                  Role Name
                </Label>
                <Input
                  id="edit-name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Enter role name"
                  disabled={selectedRole?.isSystem}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Brief description of this role"
                />
              </div>
            </div>

            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Permissions
              </h3>
              <Tabs defaultValue="grouped">
                <TabsList className="mb-3">
                  <TabsTrigger value="grouped">Grouped by Module</TabsTrigger>
                  <TabsTrigger value="all">All Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="grouped" className="space-y-4">
                  {Object.entries(permissionsByModule).map(
                    ([module, modulePermissions]) => (
                      <div key={module} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-module-${module}`}
                            checked={isAllModulePermissionsSelected(
                              modulePermissions,
                            )}
                            onCheckedChange={(checked) =>
                              toggleAllModulePermissions(
                                modulePermissions,
                                !!checked,
                              )
                            }
                            className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                            data-state={
                              isAllModulePermissionsSelected(modulePermissions)
                                ? "checked"
                                : isSomeModulePermissionsSelected(
                                      modulePermissions,
                                    )
                                  ? "indeterminate"
                                  : "unchecked"
                            }
                          />
                          <Label
                            htmlFor={`edit-module-${module}`}
                            className="text-sm font-medium"
                          >
                            {module}
                          </Label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-6">
                          {modulePermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`edit-permission-${permission.id}`}
                                checked={newRole.permissions.includes(
                                  permission.id,
                                )}
                                onCheckedChange={() =>
                                  togglePermission(permission.id)
                                }
                              />
                              <Label
                                htmlFor={`edit-permission-${permission.id}`}
                                className="text-sm"
                              >
                                {permission.name}
                                <span className="text-xs text-muted-foreground block">
                                  {permission.description}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </TabsContent>
                <TabsContent value="all" className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`edit-all-permission-${permission.id}`}
                          checked={newRole.permissions.includes(permission.id)}
                          onCheckedChange={() =>
                            togglePermission(permission.id)
                          }
                        />
                        <Label
                          htmlFor={`edit-all-permission-${permission.id}`}
                          className="text-sm"
                        >
                          {permission.name}
                          <span className="text-xs text-muted-foreground block">
                            {permission.description}
                          </span>
                          <Badge variant="outline" className="mt-1">
                            {permission.module}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog
        open={isDeleteRoleDialogOpen}
        onOpenChange={setIsDeleteRoleDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <Trash2 className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-lg">{selectedRole.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRole.description}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Users with this role: {selectedRole.userCount}
                </p>
              </div>
              {selectedRole.userCount > 0 && (
                <p className="text-sm text-destructive">
                  Warning: {selectedRole.userCount} users are currently assigned
                  to this role. These users will need to be reassigned to
                  another role.
                </p>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={handleDeleteRole}
            >
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Users Dialog */}
      <Dialog
        open={isViewUsersDialogOpen}
        onOpenChange={setIsViewUsersDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Users with {selectedRole?.name} Role</DialogTitle>
            <DialogDescription>
              {selectedRole?.userCount} users currently have this role assigned.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRole && selectedRole.userCount > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleUsers.slice(0, selectedRole.userCount).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No users currently have this role assigned.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsViewUsersDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
