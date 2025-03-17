import React from "react";
import DataTable, { Column } from "@/components/ui/data-table";
import { toast } from "@/components/ui/use-toast";

export interface Warehouse {
  id: string;
  name: string;
}

interface WarehouseTableProps {
  initialData?: Warehouse[];
  onSave?: (warehouses: Warehouse[]) => void;
  isLoading?: boolean;
  isPaginated?: boolean;
  addStartEntry?: boolean;
}

const WarehouseTable = ({
  initialData = [],
  onSave,
  isLoading = false,
  isPaginated = true,
  addStartEntry = false,
}: WarehouseTableProps) => {
  // Define columns for the warehouse table
  const columns: Column<Warehouse>[] = [
    {
      header: "Warehouse Name",
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
      caption="Warehouses"
      addButtonText="Add Warehouse"
      noDataText="No Warehouses Found"
      loadingText="Loading warehouses..."
      keyboardShortcuts={true}
      initialSortColumn="name"
      initialSortDirection="asc"
      enableExport={true}
      onExportPdf={(data) => {
        // This would be implemented with a PDF library
        console.log("Exporting to PDF:", data);
        toast({
          title: "Export Started",
          description: "Exporting warehouses to PDF",
        });
      }}
      onExportExcel={(data) => {
        // This would be implemented with an Excel library
        console.log("Exporting to Excel:", data);
        toast({
          title: "Export Started",
          description: "Exporting warehouses to Excel",
        });
      }}
    />
  );
};

export default WarehouseTable;
