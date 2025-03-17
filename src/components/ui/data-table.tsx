import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Pencil,
  Trash2,
  Check,
  X,
  Plus,
  Search,
  ArrowUpDown,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
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
import LottiePlayer from "./lottie-player";
import SuccessAnimation from "./success-animation";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  isPinned?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
  cellType?: "text" | "number" | "date" | "checkbox" | "dropdown";
}

export interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onSave?: (data: T[]) => void;
  isLoading?: boolean;
  isPaginated?: boolean;
  isSearchable?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
  addStartEntry?: boolean;
  itemsPerPage?: number;
  caption?: string;
  addButtonText?: string;
  noDataText?: string;
  loadingText?: string;
  keyboardShortcuts?: boolean;
  initialSortColumn?: keyof T;
  initialSortDirection?: "asc" | "desc";
  enableExport?: boolean;
  onExportPdf?: (data: T[]) => void;
  onExportExcel?: (data: T[]) => void;
}

const DataTable = <T extends { id: string }>({
  data = [],
  columns = [],
  onSave,
  isLoading = false,
  isPaginated = true,
  isSearchable = true,
  isSortable = true,
  isFilterable = false,
  addStartEntry = false,
  itemsPerPage = 10,
  caption = "",
  addButtonText = "Add Item",
  noDataText = "No items found",
  loadingText = "Loading items...",
  keyboardShortcuts = true,
  initialSortColumn,
  initialSortDirection = "asc",
  enableExport = false,
  onExportPdf,
  onExportExcel,
}: DataTableProps<T>) => {
  const [items, setItems] = useState<T[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<T>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newItemValues, setNewItemValues] = useState<Partial<T>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | undefined>(
    initialSortColumn,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSortDirection,
  );
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [useAddStartEntry, setAddStartEntry] = useState(addStartEntry || false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  const SHORTCUTS = {
    ADD: "a",
    SAVE: "Enter",
    CANCEL: "Escape",
    EDIT: "e",
    DELETE: "d",
  };

  // Focus input when editing or adding
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  useEffect(() => {
    if (isAdding && addInputRef.current) {
      addInputRef.current.focus();

      // Add event listener to prevent focus loss on dropdown cells
      const handleFocusOut = (e: FocusEvent) => {
        if (isAdding && addInputRef.current && !e.relatedTarget) {
          // If focus is lost and not to another element, refocus the input
          setTimeout(() => {
            if (addInputRef.current) {
              addInputRef.current.focus();
            }
          }, 0);
        }
      };

      document.addEventListener("focusout", handleFocusOut as any);
      return () => {
        document.removeEventListener("focusout", handleFocusOut as any);
      };
    }
  }, [isAdding]);

  // Update local state when data changes
  useEffect(() => {
    console.log("Data table received new data:", data);
    // Create a new array to ensure React detects the change
    setItems([...data]);

    // If we're adding a new item, make sure to reset the adding state
    if (isAdding && data.length > items.length) {
      setIsAdding(false);
      setNewItemValues({});
    }
  }, [data]);

  // Global keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent<Document>) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === SHORTCUTS.ADD && !isAdding && !editingId) {
        e.preventDefault();
        handleAddNew();
      } else if (
        e.key === SHORTCUTS.EDIT &&
        !isAdding &&
        !editingId &&
        items.length > 0
      ) {
        e.preventDefault();
        // Edit the first item if none is selected
        handleEdit(items[0]);
      } else if (
        e.key === SHORTCUTS.DELETE &&
        !isAdding &&
        !editingId &&
        items.length > 0
      ) {
        e.preventDefault();
        // Delete the first item if none is selected
        handleDeleteClick(items[0].id);
      }
    };

    document.addEventListener("keydown", handleKeyDown as any);
    return () => {
      document.removeEventListener("keydown", handleKeyDown as any);
    };
  }, [keyboardShortcuts, isAdding, editingId, items]);

  const handleEdit = (item: T) => {
    setEditingId(item.id);
    setEditValues({ ...item });
  };

  const handleSave = () => {
    if (editingId) {
      // Basic validation - ensure required fields aren't empty
      const hasEmptyRequiredField = columns.some((column) => {
        const value = editValues[column.accessorKey];
        return value === "" || value === undefined;
      });

      if (hasEmptyRequiredField) {
        toast({
          title: "Validation Error",
          description: "Required fields cannot be empty",
          variant: "destructive",
        });
        return;
      }

      // Check for duplicates if needed
      // This is a simplified example - you might want to customize this logic
      const isDuplicate = items.some(
        (item) =>
          item.id !== editingId &&
          columns.some((column) => {
            const key = column.accessorKey;
            return item[key] === editValues[key];
          }),
      );

      if (isDuplicate) {
        toast({
          title: "Validation Error",
          description: "A duplicate item already exists",
          variant: "destructive",
        });
        return;
      }

      console.log(
        "Saving edited item with id:",
        editingId,
        "and values:",
        editValues,
      );

      const updatedItems = items.map((item) =>
        item.id === editingId ? { ...item, ...editValues } : item,
      );

      setItems(updatedItems);
      if (onSave) {
        console.log(
          "Calling onSave with updated items after edit:",
          updatedItems,
        );
        onSave(updatedItems);
      }

      toast({
        title: "Success",
        description: (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6">
              <LottiePlayer
                src="https://assets3.lottiefiles.com/packages/lf20_qpwbiyxf.json"
                background="transparent"
                speed={1}
                style={{ width: "100%", height: "100%" }}
                autoplay={true}
                loop={false}
              />
            </div>
            <span>Item updated successfully</span>
          </div>
        ),
      });
    }
    setEditingId(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleDeleteClick = (id: string) => {
    setDeleteItemId(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId) return;

    const itemToDelete = items.find((item) => item.id === deleteItemId);
    if (!itemToDelete) return;

    const updatedItems = items.filter((item) => item.id !== deleteItemId);
    setItems(updatedItems);
    if (onSave) onSave(updatedItems);

    setShowDeleteDialog(false);
    setDeleteItemId(null);

    toast({
      title: "Success",
      description: (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6">
            <LottiePlayer
              src="https://assets5.lottiefiles.com/packages/lf20_jbrw3hcz.json"
              background="transparent"
              speed={1}
              style={{ width: "100%", height: "100%" }}
              autoplay={true}
              loop={false}
            />
          </div>
          <span>Item deleted successfully</span>
        </div>
      ),
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    // Initialize with empty values to ensure the form renders properly
    const emptyValues: Partial<T> = {};
    columns.forEach((column) => {
      if (column.cellType === "number") {
        emptyValues[column.accessorKey] = 0 as any;
      } else if (column.cellType === "checkbox") {
        emptyValues[column.accessorKey] = false as any;
      } else if (column.cellType === "date") {
        emptyValues[column.accessorKey] = "" as any;
      } else {
        emptyValues[column.accessorKey] = "" as any;
      }
    });
    setNewItemValues(emptyValues);
  };

  const handleAddSave = () => {
    // Basic validation - ensure required fields aren't empty
    const hasEmptyRequiredField = columns.some((column) => {
      // Skip validation for auto-populated fields like UOM
      if (column.accessorKey === ("uom" as keyof T)) return false;

      const value = newItemValues[column.accessorKey];
      return value === "" || value === undefined;
    });

    if (hasEmptyRequiredField) {
      toast({
        title: "Validation Error",
        description: "Required fields cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates if needed
    const isDuplicate = items.some((item) =>
      columns.some((column) => {
        const key = column.accessorKey;
        return item[key] === newItemValues[key];
      }),
    );

    if (isDuplicate) {
      toast({
        title: "Validation Error",
        description: "A duplicate item already exists",
        variant: "destructive",
      });
      return;
    }

    const newItem = {
      id: `item-${Date.now()}`,
      ...newItemValues,
    } as T;

    console.log("Adding new item:", newItem);

    const updatedItems = useAddStartEntry
      ? [newItem, ...items]
      : [...items, newItem];

    setItems(updatedItems);
    if (onSave) {
      console.log("Calling onSave with updated items:", updatedItems);
      onSave(updatedItems);
    }

    toast({
      title: "Success",
      description: (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6">
            <LottiePlayer
              src="https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json"
              background="transparent"
              speed={1}
              style={{ width: "100%", height: "100%" }}
              autoplay={true}
              loop={false}
            />
          </div>
          <span>New item added successfully</span>
        </div>
      ),
    });
    setShowSuccessAnimation(true);
    setIsAdding(false);
    setNewItemValues({});
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setNewItemValues({});
  };

  const handleKeyDown = (e: KeyboardEvent, type: "edit" | "add") => {
    if (e.key === SHORTCUTS.SAVE) {
      e.preventDefault();
      if (type === "edit") handleSave();
      else handleAddSave();
    } else if (e.key === SHORTCUTS.CANCEL) {
      e.preventDefault();
      if (type === "edit") handleCancel();
      else handleAddCancel();
    } else if (e.key === "Tab") {
      // Allow normal tab navigation
      return;
    }
  };

  const handleSort = (column: keyof T) => {
    if (!isSortable) return;

    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortDirection(newDirection);

    const sortedItems = [...items].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return newDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For numbers and other types
      if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setItems(sortedItems);
  };

  const handleFilterChange = (column: keyof T, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [column as string]: value,
    }));
  };

  // Apply filters and search
  let filteredItems = [...items];

  // Apply column filters
  if (isFilterable && Object.keys(filters).length > 0) {
    filteredItems = filteredItems.filter((item) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const itemValue = String(item[key as keyof T] || "").toLowerCase();
        return itemValue.includes(filterValue.toLowerCase());
      });
    });
  }

  // Apply global search
  if (isSearchable && searchTerm) {
    filteredItems = filteredItems.filter((item) =>
      columns.some((column) => {
        const value = item[column.accessorKey];
        return (
          value !== undefined &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = isPaginated
    ? filteredItems.slice(startIndex, startIndex + itemsPerPage)
    : filteredItems;

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

  const renderCell = (item: T, column: Column<T>, isEditing: boolean) => {
    if (isEditing) {
      // Handle different cell types for editing
      switch (column.cellType) {
        case "number":
          return (
            <Input
              type="number"
              ref={editingId === item.id ? editInputRef : undefined}
              value={(editValues[column.accessorKey] as string) || ""}
              onChange={(e) => {
                // Ensure non-negative values for number inputs
                const inputValue = e.target.value;
                const numValue =
                  inputValue === ""
                    ? ""
                    : Math.max(0, parseFloat(inputValue) || 0);

                setEditValues((prev) => ({
                  ...prev,
                  [column.accessorKey]:
                    e.target.type === "number" && numValue !== ""
                      ? numValue
                      : e.target.value,
                }));
              }}
              onKeyDown={(e) => handleKeyDown(e, "edit")}
              className="w-full"
              min={0}
            />
          );
        case "date":
          return (
            <Input
              type="date"
              ref={editingId === item.id ? editInputRef : undefined}
              value={(editValues[column.accessorKey] as string) || ""}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  [column.accessorKey]: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "edit")}
              className="w-full"
            />
          );
        case "checkbox":
          return (
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={Boolean(editValues[column.accessorKey])}
                onChange={(e) =>
                  setEditValues((prev) => ({
                    ...prev,
                    [column.accessorKey]: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
            </div>
          );
        case "dropdown":
          // For dropdown, we'll use the cell renderer if provided
          if (column.cell) {
            return (
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full"
                data-dropdown-cell="true"
              >
                {column.cell({ ...item, ...editValues } as T)}
              </div>
            );
          }
          // Fall back to text input if no cell renderer
          return (
            <Input
              ref={editingId === item.id ? editInputRef : undefined}
              value={(editValues[column.accessorKey] as string) || ""}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  [column.accessorKey]: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "edit")}
              className="w-full"
            />
          );
        default:
          // Default to text input
          return (
            <Input
              ref={editingId === item.id ? editInputRef : undefined}
              value={(editValues[column.accessorKey] as string) || ""}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  [column.accessorKey]: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "edit")}
              className="w-full"
            />
          );
      }
    }

    if (column.cell) {
      return column.cell(item);
    }

    // Handle different cell types for display
    switch (column.cellType) {
      case "checkbox":
        return (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={Boolean(item[column.accessorKey])}
              readOnly
              className="h-4 w-4"
            />
          </div>
        );
      case "date":
        const dateValue = item[column.accessorKey];
        if (dateValue) {
          try {
            const date = new Date(dateValue as string);
            return date.toLocaleDateString();
          } catch (e) {
            return String(dateValue);
          }
        }
        return "";
      default:
        return String(item[column.accessorKey] || "");
    }
  };

  const renderAddRow = () => {
    if (!isAdding) return null;

    return (
      <TableRow className="bg-muted/50">
        {columns.map((column, index) => (
          <TableCell key={`add-${index}`}>
            {column.cellType === "number" ? (
              <Input
                type="number"
                ref={index === 0 ? addInputRef : undefined}
                value={(newItemValues[column.accessorKey] as string) || ""}
                onChange={(e) => {
                  // Ensure non-negative values for number inputs
                  const inputValue = e.target.value;
                  const numValue =
                    inputValue === ""
                      ? ""
                      : Math.max(0, parseFloat(inputValue) || 0);

                  setNewItemValues((prev) => ({
                    ...prev,
                    [column.accessorKey]:
                      e.target.type === "number" && numValue !== ""
                        ? numValue
                        : e.target.value,
                  }));
                }}
                onKeyDown={(e) => handleKeyDown(e, "add")}
                placeholder={`Enter ${column.header.toLowerCase()}`}
                className="w-full"
                min={0}
              />
            ) : column.cellType === "date" ? (
              <Input
                type="date"
                ref={index === 0 ? addInputRef : undefined}
                value={(newItemValues[column.accessorKey] as string) || ""}
                onChange={(e) =>
                  setNewItemValues((prev) => ({
                    ...prev,
                    [column.accessorKey]: e.target.value,
                  }))
                }
                onKeyDown={(e) => handleKeyDown(e, "add")}
                className="w-full"
              />
            ) : column.cellType === "checkbox" ? (
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={Boolean(newItemValues[column.accessorKey])}
                  onChange={(e) =>
                    setNewItemValues((prev) => ({
                      ...prev,
                      [column.accessorKey]: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
              </div>
            ) : column.cell && column.cellType === "dropdown" ? (
              // For dropdown, we'll use the cell renderer if provided
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full"
                data-dropdown-cell="true"
              >
                {column.cell({ ...newItemValues, id: "new-item" } as T)}
              </div>
            ) : (
              <Input
                ref={index === 0 ? addInputRef : undefined}
                value={(newItemValues[column.accessorKey] as string) || ""}
                onChange={(e) =>
                  setNewItemValues((prev) => ({
                    ...prev,
                    [column.accessorKey]: e.target.value,
                  }))
                }
                onKeyDown={(e) => handleKeyDown(e, "add")}
                placeholder={`Enter ${column.header.toLowerCase()}`}
                className="w-full"
              />
            )}
          </TableCell>
        ))}
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddSave}
            className="mr-2 h-8 w-8 text-green-600"
            title={`Save (${SHORTCUTS.SAVE})`}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddCancel}
            className="h-8 w-8 text-red-600"
            title={`Cancel (${SHORTCUTS.CANCEL})`}
          >
            <X className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="w-full space-y-4 bg-background">
      <SuccessAnimation
        isOpen={showSuccessAnimation}
        onClose={() => setShowSuccessAnimation(false)}
        animationType="goal"
        message="Item Added Successfully!"
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected item and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isSearchable && (
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {enableExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => onExportPdf && onExportPdf(filteredItems)}
                >
                  <FileText className="mr-2 h-4 w-4" /> Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onExportExcel && onExportExcel(filteredItems)}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Entry Type: {useAddStartEntry ? "Top" : "Bottom"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setAddStartEntry(true)}>
                Top
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddStartEntry(false)}>
                Bottom
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={handleAddNew}
            disabled={isAdding}
            title={`Add (${SHORTCUTS.ADD})`}
          >
            <Plus className="mr-2 h-4 w-4" /> {addButtonText}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          {caption && (
            <TableCaption>
              {filteredItems.length === 0
                ? noDataText
                : isPaginated
                  ? `Showing ${startIndex + 1} to ${Math.min(
                      startIndex + itemsPerPage,
                      filteredItems.length,
                    )} of ${filteredItems.length} items`
                  : `Showing ${filteredItems.length} items`}
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={`header-${index}`}
                  className={cn(
                    column.isSortable !== false &&
                      isSortable &&
                      "cursor-pointer",
                    column.isPinned && "sticky left-0 z-10 bg-background",
                  )}
                  onClick={() => {
                    if (column.isSortable !== false && isSortable) {
                      handleSort(column.accessorKey);
                    }
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {column.header}
                      {column.isSortable !== false && isSortable && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                      {sortColumn === column.accessorKey && (
                        <span className="ml-1 text-xs">
                          {sortDirection === "asc" ? "(A-Z)" : "(Z-A)"}
                        </span>
                      )}
                    </div>
                    {column.isFilterable && isFilterable && (
                      <Popover>
                        <PopoverTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                          >
                            <Filter className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-4">
                            <h4 className="font-medium">
                              Filter {column.header}
                            </h4>
                            <div className="space-y-2">
                              <Input
                                placeholder={`Filter ${column.header}`}
                                value={
                                  filters[column.accessorKey as string] || ""
                                }
                                onChange={(e) =>
                                  handleFilterChange(
                                    column.accessorKey,
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderAddRow()}

            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 mb-4">
                      <LottiePlayer
                        src="https://assets9.lottiefiles.com/packages/lf20_x62chJ.json"
                        background="transparent"
                        speed={1}
                        style={{ width: "100%", height: "100%" }}
                        loop={true}
                        autoplay={true}
                      />
                    </div>
                    <p className="text-muted-foreground">{loadingText}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-32 h-32 mb-4">
                      <LottiePlayer
                        src="https://assets10.lottiefiles.com/packages/lf20_wnqlfojb.json"
                        background="transparent"
                        speed={1}
                        style={{ width: "100%", height: "100%" }}
                        loop={true}
                        autoplay={true}
                      />
                    </div>
                    <p className="text-lg font-medium">{noDataText}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "transition-colors hover:bg-muted/50 border-b",
                    editingId === item.id && "bg-muted/50",
                  )}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={`${item.id}-${index}`}
                      className={cn(
                        column.isPinned && "sticky left-0 z-10 bg-background",
                      )}
                    >
                      {renderCell(item, column, editingId === item.id)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    {editingId === item.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSave}
                          className="mr-2 h-8 w-8 text-green-600"
                          title={`Save (${SHORTCUTS.SAVE})`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancel}
                          className="h-8 w-8 text-red-600"
                          title={`Cancel (${SHORTCUTS.CANCEL})`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          className="mr-2 h-8 w-8 text-blue-600"
                          title={`Edit (${SHORTCUTS.EDIT})`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(item.id)}
                          className="h-8 w-8 text-red-600"
                          title={`Delete (${SHORTCUTS.DELETE})`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isPaginated && totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50",
                )}
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
                className={cn(
                  currentPage === totalPages &&
                    "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default DataTable;
