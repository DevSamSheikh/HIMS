import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomerForm from "./CustomerForm";
import ListTable, { Column, Filter } from "@/components/ui/list-table";

interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phoneNo: string;
  email: string;
  address: string;
  city: string;
  cityName: string;
  isActive: boolean;
  creditLimit: number;
  openingBalance: number;
}

const CustomerTable: React.FC = () => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  // Mock data for customers
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      customerCode: "CUST001",
      name: "John Doe",
      phoneNo: "1234567890",
      email: "john.doe@example.com",
      address: "123 Main St",
      city: "1",
      cityName: "New York",
      isActive: true,
      creditLimit: 5000,
      openingBalance: 0,
    },
    {
      id: "2",
      customerCode: "CUST002",
      name: "Jane Smith",
      phoneNo: "9876543210",
      email: "jane.smith@example.com",
      address: "456 Oak Ave",
      city: "2",
      cityName: "Los Angeles",
      isActive: true,
      creditLimit: 10000,
      openingBalance: 2500,
    },
    {
      id: "3",
      customerCode: "CUST003",
      name: "Robert Johnson",
      phoneNo: "5551234567",
      email: "robert.johnson@example.com",
      address: "789 Pine Rd",
      city: "3",
      cityName: "Chicago",
      isActive: false,
      creditLimit: 7500,
      openingBalance: 1000,
    },
  ]);

  // Mock data for cities
  const cities = [
    { id: "1", name: "New York" },
    { id: "2", name: "Los Angeles" },
    { id: "3", name: "Chicago" },
    { id: "4", name: "Houston" },
    { id: "5", name: "Phoenix" },
  ];

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((c) => c.id !== customerToDelete));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleSaveCustomer = (data: any) => {
    if (selectedCustomer) {
      // Edit existing customer
      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                ...data,
                cityName:
                  cities.find((city) => city.id === data.city)?.name || "",
              }
            : c,
        ),
      );
    } else {
      // Add new customer
      const newId = (
        parseInt(customers[customers.length - 1]?.id || "0") + 1
      ).toString();
      const newCustomer = {
        id: newId,
        ...data,
        cityName: cities.find((city) => city.id === data.city)?.name || "",
      };
      setCustomers([...customers, newCustomer]);
    }
  };

  const exportData = (type: "pdf" | "excel") => {
    // This is a placeholder function for export functionality
    console.log(`Exporting data as ${type}`);
    alert(
      `Exporting data as ${type}. This feature will be implemented with actual file generation.`,
    );
  };

  // Define columns for the ListTable component
  const columns: Column<Customer>[] = [
    {
      header: "Customer Code",
      accessorKey: "customerCode",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNo",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "City",
      accessorKey: "cityName",
    },
    {
      header: "Credit Limit",
      accessorKey: "creditLimit",
      cell: (item) => `$${item.creditLimit.toFixed(2)}`,
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (item) => (
        <Badge
          variant={item.isActive ? "default" : "secondary"}
          className={item.isActive ? "bg-green-500" : "bg-red-500"}
        >
          {item.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  // Define filters for the ListTable component
  const filters: Filter<Customer>[] = [
    {
      key: "city",
      label: "City",
      options: cities,
      defaultValue: "all-city",
    },
    {
      key: "isActive",
      label: "Status",
      options: [
        { id: "true", name: "Active" },
        { id: "false", name: "Inactive" },
      ],
      defaultValue: "all-isActive",
    },
  ];

  return (
    <>
      <ListTable
        title="Pharmacy Customers"
        data={customers}
        columns={columns}
        filters={filters}
        onAdd={handleAddCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        addButtonText="Add Customer"
        noDataText="No customers found"
        isSearchable={true}
        isPaginated={true}
        itemsPerPage={10}
        onExport={exportData}
        statusKey="isActive"
        statusLabels={{ true: "Active", false: "Inactive" }}
      />

      <CustomerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveCustomer}
        initialData={selectedCustomer}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              customer and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CustomerTable;
