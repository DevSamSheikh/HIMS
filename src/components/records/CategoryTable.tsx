import React from "react";
import DataTable, { Column } from "@/components/ui/data-table";
import { toast } from "@/components/ui/use-toast";

export interface Category {
  id: string;
  name: string;
}

interface CategoryTableProps {
  initialData?: Category[];
  onSave?: (categories: Category[]) => void;
  isLoading?: boolean;
  isPaginated?: boolean;
  addStartEntry?: boolean;
}

const CategoryTable = ({
  initialData = [],
  onSave,
  isLoading = false,
  isPaginated = true,
  addStartEntry = false,
}: CategoryTableProps) => {
  // Define columns for the category table
  const columns: Column<Category>[] = [
    {
      header: "Category Name",
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
      caption="Categories"
      addButtonText="Add Category"
      noDataText="No Categories Found"
      loadingText="Loading categories..."
      keyboardShortcuts={true}
      initialSortColumn="name"
      initialSortDirection="asc"
      enableExport={true}
      onExportPdf={(data) => {
        // This would be implemented with a PDF library
        console.log("Exporting to PDF:", data);
        toast({
          title: "Export Started",
          description: "Exporting categories to PDF",
        });
      }}
      onExportExcel={(data) => {
        // This would be implemented with an Excel library
        console.log("Exporting to Excel:", data);
        toast({
          title: "Export Started",
          description: "Exporting categories to Excel",
        });
      }}
    />
  );
};

export default CategoryTable;
