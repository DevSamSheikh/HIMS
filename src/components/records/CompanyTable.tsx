import React from "react";
import DataTable, { Column } from "@/components/ui/data-table";
import { toast } from "@/components/ui/use-toast";

export interface Company {
  id: string;
  name: string;
  address?: string;
  contact?: string;
}

interface CompanyTableProps {
  initialData?: Company[];
  onSave?: (companies: Company[]) => void;
  isLoading?: boolean;
  isPaginated?: boolean;
  addStartEntry?: boolean;
}

const CompanyTable = ({
  initialData = [],
  onSave,
  isLoading = false,
  isPaginated = true,
  addStartEntry = false,
}: CompanyTableProps) => {
  // Define columns for the company table
  const columns: Column<Company>[] = [
    {
      header: "Company Name",
      accessorKey: "name",
      isSortable: true,
      isFilterable: true,
    },
    {
      header: "Address",
      accessorKey: "address",
      isSortable: true,
      isFilterable: true,
    },
    {
      header: "Contact",
      accessorKey: "contact",
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
      caption="Companies"
      addButtonText="Add Company"
      noDataText="No Companies Found"
      loadingText="Loading companies..."
      keyboardShortcuts={true}
      initialSortColumn="name"
      initialSortDirection="asc"
      enableExport={true}
      onExportPdf={(data) => {
        // This would be implemented with a PDF library
        console.log("Exporting to PDF:", data);
        toast({
          title: "Export Started",
          description: "Exporting companies to PDF",
        });
      }}
      onExportExcel={(data) => {
        // This would be implemented with an Excel library
        console.log("Exporting to Excel:", data);
        toast({
          title: "Export Started",
          description: "Exporting companies to Excel",
        });
      }}
    />
  );
};

export default CompanyTable;
