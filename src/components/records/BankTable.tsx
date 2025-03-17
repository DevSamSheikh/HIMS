import React from "react";
import DataTable, { Column } from "@/components/ui/data-table";
import { toast } from "@/components/ui/use-toast";

export interface Bank {
  id: string;
  name: string;
}

interface BankTableProps {
  initialData?: Bank[];
  onSave?: (banks: Bank[]) => void;
  isLoading?: boolean;
  isPaginated?: boolean;
  addStartEntry?: boolean;
}

const BankTable = ({
  initialData = [],
  onSave,
  isLoading = false,
  isPaginated = true,
  addStartEntry = false,
}: BankTableProps) => {
  // Define columns for the bank table
  const columns: Column<Bank>[] = [
    {
      header: "Bank Name",
      accessorKey: "name",
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
      caption="Banks"
      addButtonText="Add Bank"
      noDataText="No Banks Found"
      loadingText="Loading banks..."
      keyboardShortcuts={true}
      initialSortColumn="name"
      initialSortDirection="asc"
      enableExport={true}
      onExportPdf={(data) => {
        // This would be implemented with a PDF library
        console.log("Exporting to PDF:", data);
        toast({
          title: "Export Started",
          description: "Exporting banks to PDF",
        });
      }}
      onExportExcel={(data) => {
        // This would be implemented with an Excel library
        console.log("Exporting to Excel:", data);
        toast({
          title: "Export Started",
          description: "Exporting banks to Excel",
        });
      }}
    />
  );
};

export default BankTable;
