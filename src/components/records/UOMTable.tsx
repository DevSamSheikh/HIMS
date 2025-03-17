import React from "react";
import DataTable, { Column } from "@/components/ui/data-table";
import { toast } from "@/components/ui/use-toast";

export interface UOM {
  id: string;
  name: string;
}

interface UOMTableProps {
  initialData?: UOM[];
  onSave?: (uoms: UOM[]) => void;
  isLoading?: boolean;
  isPaginated?: boolean;
  addStartEntry?: boolean;
}

const UOMTable = ({
  initialData = [],
  onSave,
  isLoading = false,
  isPaginated = true,
  addStartEntry = false,
}: UOMTableProps) => {
  // Define columns for the UOM table
  const columns: Column<UOM>[] = [
    {
      header: "Unit of Measurement",
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
      caption="Units of Measurement"
      addButtonText="Add UOM"
      noDataText="No UOMs Found"
      loadingText="Loading UOMs..."
      keyboardShortcuts={true}
      initialSortColumn="name"
      initialSortDirection="asc"
      enableExport={true}
      onExportPdf={(data) => {
        // This would be implemented with a PDF library
        console.log("Exporting to PDF:", data);
        toast({
          title: "Export Started",
          description: "Exporting UOMs to PDF",
        });
      }}
      onExportExcel={(data) => {
        // This would be implemented with an Excel library
        console.log("Exporting to Excel:", data);
        toast({
          title: "Export Started",
          description: "Exporting UOMs to Excel",
        });
      }}
    />
  );
};

export default UOMTable;
