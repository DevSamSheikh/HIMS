import React from "react";
import DataTable, { Column } from "@/components/ui/data-table";
import { toast } from "@/components/ui/use-toast";

export interface Department {
  id: string;
  name: string;
  code: string;
  location: string;
}

interface DepartmentTableProps {
  initialData?: Department[];
  onSave?: (departments: Department[]) => void;
  isLoading?: boolean;
  isPaginated?: boolean;
  addStartEntry?: boolean;
}

const DepartmentTable = ({
  initialData = [],
  onSave,
  isLoading = false,
  isPaginated = true,
  addStartEntry = false,
}: DepartmentTableProps) => {
  // Define columns for the department table
  const columns: Column<Department>[] = [
    {
      header: "Department Name",
      accessorKey: "name",
      isSortable: true,
      isFilterable: true,
    },
    {
      header: "Code",
      accessorKey: "code",
      isSortable: true,
      isFilterable: true,
    },
    {
      header: "Location",
      accessorKey: "location",
      isSortable: true,
      isFilterable: true,
    },
  ];

  return (
    <DataTable
      data={initialData}
      columns={columns}
      onSave={onSave}
      isLoading={isLoading}
      isPaginated={isPaginated}
      isSearchable={true}
      isSortable={true}
      isFilterable={true}
      addStartEntry={addStartEntry}
      caption="Departments"
      addButtonText="Add Department"
      noDataText="No Departments Found"
      loadingText="Loading departments..."
      keyboardShortcuts={true}
      initialSortColumn="name"
      initialSortDirection="asc"
      enableExport={true}
      onExportPdf={(data) => {
        // This would be implemented with a PDF library
        console.log("Exporting to PDF:", data);
        toast({
          title: "Export Started",
          description: "Exporting departments to PDF",
        });
      }}
      onExportExcel={(data) => {
        // This would be implemented with an Excel library
        console.log("Exporting to Excel:", data);
        toast({
          title: "Export Started",
          description: "Exporting departments to Excel",
        });
      }}
    />
  );
};

export default DepartmentTable;
