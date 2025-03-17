import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import ExportButtons from "@/components/ui/export-buttons";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  isFilterable?: boolean;
}

export interface Filter<T> {
  key: keyof T;
  label: string;
  options: { id: string; name: string }[];
  defaultValue: string;
}

export interface ListTableProps<T extends { id: string }> {
  title: string;
  data: T[];
  columns: Column<T>[];
  filters?: Filter<T>[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  addButtonText?: string;
  noDataText?: string;
  isSearchable?: boolean;
  isPaginated?: boolean;
  itemsPerPage?: number;
  onExport?: (type: "pdf" | "excel") => void;
  statusKey?: keyof T;
  statusLabels?: {
    true: string;
    false: string;
  };
}

const ListTable = <T extends { id: string }>({
  title,
  data = [],
  columns = [],
  filters = [],
  onAdd,
  onEdit,
  onDelete,
  addButtonText = "Add Item",
  noDataText = "No items found",
  isSearchable = true,
  isPaginated = true,
  itemsPerPage = 10,
  onExport,
  statusKey,
  statusLabels = { true: "Active", false: "Inactive" },
}: ListTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [filterSearchTerms, setFilterSearchTerms] = useState<
    Record<string, string>
  >({});

  // Initialize default filter values
  useEffect(() => {
    const defaultValues: Record<string, string> = {};
    filters.forEach((filter) => {
      defaultValues[filter.key as string] = filter.defaultValue;
    });
    setFilterValues(defaultValues);
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle filter search term change
  const handleFilterSearchChange = (key: string, value: string) => {
    setFilterSearchTerms((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Filter data based on search term and filters
  const filteredData = data.filter((item) => {
    // Apply search filter
    const matchesSearch =
      !searchTerm ||
      columns.some((column) => {
        const value = item[column.accessorKey];
        return (
          value !== undefined &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

    // Apply column filters
    const matchesFilters = Object.entries(filterValues).every(
      ([key, value]) => {
        if (value.startsWith("all-")) return true;
        return String(item[key as keyof T]) === value;
      },
    );

    return matchesSearch && matchesFilters;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = isPaginated
    ? filteredData.slice(startIndex, startIndex + itemsPerPage)
    : filteredData;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("ellipsis1");
      }

      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis2");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(item);
    }

    // Handle status display if this column is the status column
    if (statusKey && column.accessorKey === statusKey) {
      const isActive = Boolean(item[statusKey]);
      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={isActive ? "bg-green-500" : "bg-red-500"}
        >
          {isActive ? statusLabels.true : statusLabels.false}
        </Badge>
      );
    }

    return String(item[column.accessorKey] || "");
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-2">
          {onExport && <ExportButtons onExport={onExport} />}
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" /> {addButtonText}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {isSearchable && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when search changes
                }}
                className="pl-8"
              />
            </div>
          )}

          {filters.map((filter, index) => (
            <Select
              key={`filter-${index}`}
              value={filterValues[filter.key as string] || filter.defaultValue}
              onValueChange={(value) =>
                handleFilterChange(filter.key as string, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={`Filter by ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                <div className="flex items-center px-3 py-2 sticky top-0 bg-white">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${filter.label.toLowerCase()}...`}
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
                    value={filterSearchTerms[filter.key as string] || ""}
                    onChange={(e) =>
                      handleFilterSearchChange(
                        filter.key as string,
                        e.target.value,
                      )
                    }
                  />
                </div>
                <SelectItem value={`all-${filter.key}`}>
                  All {filter.label}
                </SelectItem>
                {filter.options
                  .filter((option) =>
                    option.name
                      .toLowerCase()
                      .includes(
                        (
                          filterSearchTerms[filter.key as string] || ""
                        ).toLowerCase(),
                      ),
                  )
                  .map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={`header-${index}`}>{column.header}</TableHead>
                ))}
                {(onEdit || onDelete) && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column, index) => (
                      <TableCell key={`${item.id}-${index}`}>
                        {renderCell(item, column)}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="text-center py-4"
                  >
                    {noDataText}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {isPaginated && totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={`page-${index}`}>
                    {page === "ellipsis1" || page === "ellipsis2" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page as number)}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListTable;
