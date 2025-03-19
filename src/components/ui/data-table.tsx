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
import { Checkbox } from "./checkbox";
import { Label } from "./label";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  isPinned?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
  cellType?: "text" | "number" | "date" | "checkbox" | "dropdown";
  width?: string;
  hidden?: boolean;
  required?: boolean;
  isValid?: (value: any) => boolean | { valid: boolean; message: string };
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
  options?: { id: string; name: string }[];
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
  enableColumnConfiguration?: boolean;
  defaultPinnedColumns?: string[];
  onColumnConfigChange?: (columns: Column<T>[]) => void;
  horizontalScroll?: boolean;
  disableSaveAnimation?: boolean;
}

function DataTable<T extends { id: string }>(props: DataTableProps<T>) {
  const {
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
    enableColumnConfiguration = false,
    defaultPinnedColumns = [],
    onColumnConfigChange,
    horizontalScroll = false,
    disableSaveAnimation = false,
  } = props;

  const [items, setItems] = useState<T[]>(data);
  const [tableColumns, setTableColumns] = useState<Column<T>[]>(() => {
    // Apply default pinned columns if provided
    if (defaultPinnedColumns.length > 0) {
      return columns.map((col) => ({
        ...col,
        isPinned: defaultPinnedColumns.includes(col.accessorKey as string),
      }));
    }
    return columns;
  });
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
    NEXT_FIELD: "Tab",
    PREV_FIELD: "Shift+Tab",
  };

  // Focus input when editing or adding
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // Focus on add input when isAdding changes
  useEffect(() => {
    if (isAdding && addInputRef.current) {
      setTimeout(() => {
        if (addInputRef.current) {
          addInputRef.current.focus();
        }
      }, 100);
    }
  }, [isAdding]);

  // Scroll to the add row when isAdding changes
  useEffect(() => {
    if (isAdding) {
      // Scroll to the add row
      setTimeout(() => {
        const tableElement = document.getElementById("data-table-container");
        if (tableElement) {
          if (!useAddStartEntry) {
            tableElement.scrollTop = tableElement.scrollHeight;
          } else {
            tableElement.scrollTop = 0;
          }
        }
      }, 100);
    }
  }, [isAdding, useAddStartEntry]);

  useEffect(() => {
    if (isAdding && addInputRef.current) {
      addInputRef.current.focus();

      // Add event listener to prevent focus loss on dropdown cells
      const handleFocusOut = (e: FocusEvent) => {
        // Check if the related target is within a dropdown or popover
        const isInDropdown =
          e.relatedTarget &&
          ((e.relatedTarget as HTMLElement).closest(
            '[data-dropdown-cell="true"]',
          ) ||
            (e.relatedTarget as HTMLElement).closest('[role="dialog"]') ||
            (e.relatedTarget as HTMLElement).closest('[role="listbox"]') ||
            (e.relatedTarget as HTMLElement).closest('[data-state="open"]'));

        if (
          isAdding &&
          addInputRef.current &&
          !e.relatedTarget &&
          !isInDropdown
        ) {
          // If focus is lost and not to another element or dropdown, refocus the input
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
    // Only reset adding state when data changes and it's not just an update to existing items
    if (data.length !== items.length) {
      setIsAdding(false);
      // Clear form values after a short delay to ensure state updates properly
      setTimeout(() => {
        setNewItemValues({});
      }, 50);
    }
  }, [data, items.length]);

  // Update columns when columns prop changes
  useEffect(() => {
    setTableColumns((prevColumns) => {
      // Preserve pinned state and visibility from previous columns
      const updatedColumns = columns.map((newCol) => {
        const prevCol = prevColumns.find(
          (p) => p.accessorKey === newCol.accessorKey,
        );
        if (prevCol) {
          return {
            ...newCol,
            isPinned: prevCol.isPinned,
            hidden: prevCol.hidden,
          };
        }
        return newCol;
      });
      return updatedColumns;
    });
  }, [columns]);

  // Global keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent<Document>) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement ||
        document.activeElement?.hasAttribute("contenteditable") ||
        document.activeElement?.closest('[data-dropdown-cell="true"]')
      ) {
        return;
      }

      // Check if any dropdown is open
      const isDropdownOpen = document.querySelector('[data-state="open"]');
      if (isDropdownOpen) return;

      if (e.key === SHORTCUTS.ADD && !isAdding && !editingId) {
        e.preventDefault();
        console.log("Add shortcut triggered");
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

  // Handle column configuration changes
  const handleColumnConfigChange = (
    columnKey: keyof T,
    config: { isPinned?: boolean; hidden?: boolean },
  ) => {
    setTableColumns((prev) => {
      const updated = prev.map((col) => {
        if (col.accessorKey === columnKey) {
          return { ...col, ...config };
        }
        return col;
      });

      // Notify parent component if callback provided
      if (onColumnConfigChange) {
        onColumnConfigChange(updated);
      }

      return updated;
    });
  };

  const handleEdit = (item: T) => {
    setEditingId(item.id);
    setEditValues({ ...item });
  };

  const handleSave = () => {
    if (editingId) {
      // Enhanced validation - check required fields and custom validation
      const validationErrors: { field: string; message: string }[] = [];

      tableColumns.forEach((column) => {
        const value = editValues[column.accessorKey];
        const fieldName = column.header;

        // Check required fields
        if (
          column.required &&
          (value === "" || value === undefined || value === null)
        ) {
          validationErrors.push({
            field: String(column.accessorKey),
            message: `${fieldName} is required`,
          });
        }

        // Check custom validation if provided
        if (value !== undefined && value !== null && column.isValid) {
          const validationResult = column.isValid(value);

          if (typeof validationResult === "object") {
            if (!validationResult.valid) {
              validationErrors.push({
                field: String(column.accessorKey),
                message: validationResult.message,
              });
            }
          } else if (!validationResult) {
            validationErrors.push({
              field: String(column.accessorKey),
              message: `${fieldName} has an invalid value`,
            });
          }
        }

        // Type-specific validations
        if (
          column.cellType === "number" &&
          value !== undefined &&
          value !== null
        ) {
          if (column.min !== undefined && Number(value) < column.min) {
            validationErrors.push({
              field: String(column.accessorKey),
              message: `${fieldName} must be at least ${column.min}`,
            });
          }
          if (column.max !== undefined && Number(value) > column.max) {
            validationErrors.push({
              field: String(column.accessorKey),
              message: `${fieldName} must be at most ${column.max}`,
            });
          }
        }
      });

      if (validationErrors.length > 0) {
        // Show the first error message
        toast({
          title: "Validation Error",
          description: validationErrors[0].message,
          variant: "destructive",
        });
        return;
      }

      // Check for duplicates if needed
      // This is a simplified example - you might want to customize this logic
      const isDuplicate = items.some(
        (item) =>
          item.id !== editingId &&
          tableColumns.some((column) => {
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
    // Initialize with empty values to ensure the form renders properly
    const emptyValues: Partial<T> = {};
    tableColumns.forEach((column) => {
      if (column.cellType === "number") {
        // Use min value if provided, otherwise default to 0
        emptyValues[column.accessorKey] = (
          column.min !== undefined ? column.min : 0
        ) as any;
      } else if (column.cellType === "checkbox") {
        emptyValues[column.accessorKey] = false as any;
      } else if (column.cellType === "date") {
        // Default to today's date for date fields
        emptyValues[column.accessorKey] = new Date()
          .toISOString()
          .split("T")[0] as any;
      } else if (
        column.cellType === "dropdown" &&
        column.options &&
        column.options.length > 0
      ) {
        // Default to first option for dropdowns
        emptyValues[column.accessorKey] = column.options[0].id as any;
      } else {
        emptyValues[column.accessorKey] = "" as any;
      }
    });

    console.log("Initializing new item with values:", emptyValues);

    // Always set to false first to ensure state is reset
    setIsAdding(false);

    // Use setTimeout to ensure the state update has time to process
    setTimeout(() => {
      // Set both states in a single render cycle
      setNewItemValues({ ...emptyValues });
      setIsAdding(true);

      // Force a re-render to ensure the add row is displayed
      setTimeout(() => {
        const tableElement = document.getElementById("data-table-container");
        if (tableElement) {
          if (!useAddStartEntry) {
            tableElement.scrollTop = tableElement.scrollHeight;
          } else {
            tableElement.scrollTop = 0;
          }
        }
      }, 50);
    }, 10);
  };

  const handleAddSave = () => {
    try {
      console.log("handleAddSave called with newItemValues:", newItemValues);

      // Enhanced validation for adding new items
      const validationErrors: { field: string; message: string }[] = [];

      tableColumns.forEach((column) => {
        const value = newItemValues[column.accessorKey];
        const fieldName = column.header;

        // Check required fields
        if (
          column.required &&
          (value === "" || value === undefined || value === null)
        ) {
          validationErrors.push({
            field: String(column.accessorKey),
            message: `${fieldName} is required`,
          });
        }

        // Check custom validation if provided
        if (value !== undefined && value !== null && column.isValid) {
          const validationResult = column.isValid(value);

          if (typeof validationResult === "object") {
            if (!validationResult.valid) {
              validationErrors.push({
                field: String(column.accessorKey),
                message: validationResult.message,
              });
            }
          } else if (!validationResult) {
            validationErrors.push({
              field: String(column.accessorKey),
              message: `${fieldName} has an invalid value`,
            });
          }
        }

        // Type-specific validations
        if (
          column.cellType === "number" &&
          value !== undefined &&
          value !== null
        ) {
          if (column.min !== undefined && Number(value) < column.min) {
            validationErrors.push({
              field: String(column.accessorKey),
              message: `${fieldName} must be at least ${column.min}`,
            });
          }
          if (column.max !== undefined && Number(value) > column.max) {
            validationErrors.push({
              field: String(column.accessorKey),
              message: `${fieldName} must be at most ${column.max}`,
            });
          }
        }
      });

      if (validationErrors.length > 0) {
        // Show the first error message
        toast({
          title: "Validation Error",
          description: validationErrors[0].message,
          variant: "destructive",
        });
        return;
      }

      // Create a unique ID for the new item
      const newId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create a complete item with all required properties
      const newItem = { id: newId } as T;

      // Add all properties from newItemValues
      Object.keys(newItemValues).forEach((key) => {
        (newItem as any)[key] = newItemValues[key as keyof T];
      });

      console.log("Adding new item:", newItem);

      // Create a new array for updated items to ensure proper state update
      let updatedItems: T[];

      // Add the new item to the beginning or end based on the setting
      if (useAddStartEntry) {
        updatedItems = [newItem, ...items];
      } else {
        updatedItems = [...items, newItem];
      }

      console.log("Updated items array:", updatedItems);

      // First update the local state
      setItems(updatedItems);

      // Then call onSave if provided
      if (onSave) {
        console.log("Calling onSave with updated items:", updatedItems);
        if (disableSaveAnimation) {
          onSave(updatedItems);
        } else {
          // Show success animation
          setShowSuccessAnimation(true);
          onSave(updatedItems);
        }
      }

      if (!disableSaveAnimation) {
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
      } else {
        toast({
          title: "Success",
          description: "New item added successfully",
        });
      }

      // Reset states after successful add - important to set isAdding to false first
      setIsAdding(false);
      // Clear the form values after a short delay to ensure state updates properly
      setTimeout(() => {
        setNewItemValues({});
      }, 50);

      // Add a new row after a short delay if needed
      if (items.length === 0) {
        setTimeout(() => {
          handleAddNew();
        }, 300);
      }
    } catch (error) {
      console.error("Error in handleAddSave:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while adding the item: " +
          (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    }
  };

  const handleAddCancel = () => {
    console.log("Cancelling add operation");
    setIsAdding(false);
    // Clear form values after a short delay to ensure state updates properly
    setTimeout(() => {
      setNewItemValues({});
    }, 50);
  };

  const handleKeyDown = (e: KeyboardEvent, type: "edit" | "add") => {
    // Check if any dropdown is open
    const isDropdownOpen = document.querySelector('[data-state="open"]');

    if (e.key === SHORTCUTS.SAVE && !isDropdownOpen) {
      e.preventDefault();
      console.log(
        `${type === "edit" ? "Edit" : "Add"} save shortcut triggered`,
      );
      if (type === "edit") handleSave();
      else handleAddSave();
    } else if (e.key === SHORTCUTS.CANCEL && !isDropdownOpen) {
      e.preventDefault();
      console.log(
        `${type === "edit" ? "Edit" : "Add"} cancel shortcut triggered`,
      );
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
                const minValue = column.min !== undefined ? column.min : 0;
                const numValue =
                  inputValue === ""
                    ? ""
                    : Math.max(minValue, parseFloat(inputValue) || 0);

                setEditValues((prev) => ({
                  ...prev,
                  [column.accessorKey]:
                    e.target.type === "number" && numValue !== ""
                      ? numValue
                      : e.target.value,
                }));
              }}
              onKeyDown={(e) => handleKeyDown(e, "edit")}
              className={cn(
                "w-full",
                column.required && "border-l-2 border-l-primary",
              )}
              min={column.min !== undefined ? column.min : 0}
              max={column.max}
              step={column.step || "1"}
              placeholder={column.placeholder}
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
              className={cn(
                "w-full",
                column.required && "border-l-2 border-l-primary",
              )}
              placeholder={column.placeholder}
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
              className={cn(
                "w-full",
                column.required && "border-l-2 border-l-primary",
              )}
              placeholder={
                column.placeholder || `Enter ${column.header.toLowerCase()}`
              }
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
              className={cn(
                "w-full",
                column.required && "border-l-2 border-l-primary",
              )}
              placeholder={
                column.placeholder || `Enter ${column.header.toLowerCase()}`
              }
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

    console.log("Rendering add row with values:", newItemValues);

    return (
      <TableRow className="bg-muted/50" data-testid="add-row">
        {tableColumns
          .filter((column) => !column.hidden)
          .map((column, index) => (
            <TableCell
              key={`add-${index}`}
              className={cn(
                column.isPinned &&
                  "sticky left-0 z-10 bg-muted/50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                column.width && column.width,
              )}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.cellType === "number" ? (
                <Input
                  type="number"
                  ref={index === 0 ? addInputRef : undefined}
                  value={(newItemValues[column.accessorKey] as string) || ""}
                  onChange={(e) => {
                    // Ensure non-negative values for number inputs
                    const inputValue = e.target.value;
                    const minValue = column.min !== undefined ? column.min : 0;
                    const numValue =
                      inputValue === ""
                        ? ""
                        : Math.max(minValue, parseFloat(inputValue) || 0);

                    setNewItemValues((prev) => {
                      const updated = {
                        ...prev,
                        [column.accessorKey]:
                          e.target.type === "number" && numValue !== ""
                            ? numValue
                            : e.target.value,
                      };
                      console.log("Updated newItemValues:", updated);
                      return updated;
                    });
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "add")}
                  placeholder={
                    column.placeholder || `Enter ${column.header.toLowerCase()}`
                  }
                  className={cn(
                    "w-full",
                    column.required && "border-l-2 border-l-primary",
                  )}
                  min={column.min !== undefined ? column.min : 0}
                  max={column.max}
                  step={column.step || "1"}
                />
              ) : column.cellType === "date" ? (
                <Input
                  type="date"
                  ref={index === 0 ? addInputRef : undefined}
                  value={(newItemValues[column.accessorKey] as string) || ""}
                  onChange={(e) =>
                    setNewItemValues((prev) => {
                      const updated = {
                        ...prev,
                        [column.accessorKey]: e.target.value,
                      };
                      console.log("Updated newItemValues:", updated);
                      return updated;
                    })
                  }
                  onKeyDown={(e) => handleKeyDown(e, "add")}
                  className={cn(
                    "w-full",
                    column.required && "border-l-2 border-l-primary",
                  )}
                  placeholder={column.placeholder}
                />
              ) : column.cellType === "checkbox" ? (
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={Boolean(newItemValues[column.accessorKey])}
                    onChange={(e) =>
                      setNewItemValues((prev) => {
                        const updated = {
                          ...prev,
                          [column.accessorKey]: e.target.checked,
                        };
                        console.log("Updated newItemValues:", updated);
                        return updated;
                      })
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
                    setNewItemValues((prev) => {
                      const updated = {
                        ...prev,
                        [column.accessorKey]: e.target.value,
                      };
                      console.log("Updated newItemValues:", updated);
                      return updated;
                    })
                  }
                  onKeyDown={(e) => handleKeyDown(e, "add")}
                  placeholder={
                    column.placeholder || `Enter ${column.header.toLowerCase()}`
                  }
                  className={cn(
                    "w-full",
                    column.required && "border-l-2 border-l-primary",
                  )}
                />
              )}
            </TableCell>
          ))}
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Save button clicked");
              handleAddSave();
            }}
            className="mr-2 h-8 w-8 text-green-600"
            title={`Save (${SHORTCUTS.SAVE})`}
            data-testid="add-save-button"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Cancel button clicked");
              handleAddCancel();
            }}
            className="h-8 w-8 text-red-600"
            title={`Cancel (${SHORTCUTS.CANCEL})`}
            data-testid="add-cancel-button"
          >
            <X className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="w-full space-y-4 bg-background" id="data-table-root">
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
          {enableColumnConfiguration && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Configure Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Column Configuration</h4>
                  <div className="space-y-2">
                    {tableColumns.map((column, index) => (
                      <div
                        key={`config-${index}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`visible-${index}`}
                            checked={!column.hidden}
                            onCheckedChange={(checked) =>
                              handleColumnConfigChange(column.accessorKey, {
                                hidden: !checked,
                              })
                            }
                          />
                          <Label htmlFor={`visible-${index}`}>
                            {column.header}
                          </Label>
                        </div>
                        <Button
                          variant={column.isPinned ? "secondary" : "outline"}
                          size="sm"
                          onClick={() =>
                            handleColumnConfigChange(column.accessorKey, {
                              isPinned: !column.isPinned,
                            })
                          }
                        >
                          {column.isPinned ? "Unpin" : "Pin"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Add button clicked");
              // Force isAdding to false first to ensure we can add again
              setIsAdding(false);
              setNewItemValues({});
              // Use setTimeout to ensure state update has processed
              setTimeout(() => handleAddNew(), 20);
            }}
            title={`Add (${SHORTCUTS.ADD})`}
            data-testid="add-button"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> {addButtonText}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "rounded-md border data-table-container",
          horizontalScroll && "overflow-x-auto",
          "max-h-[600px] overflow-y-auto",
        )}
        id="data-table-container"
      >
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              {tableColumns
                .filter((column) => !column.hidden)
                .map((column, index) => (
                  <TableHead
                    key={`header-${index}`}
                    className={cn(
                      column.isPinned &&
                        "sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                      column.width && column.width,
                      isSortable &&
                        column.isSortable !== false &&
                        "cursor-pointer",
                    )}
                    style={column.width ? { width: column.width } : undefined}
                    onClick={() =>
                      isSortable &&
                      column.isSortable !== false &&
                      handleSort(column.accessorKey)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.header}</span>
                      {isSortable && column.isSortable !== false && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.filter((c) => !c.hidden).length + 1}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative h-8 w-8">
                      <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {loadingText}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedItems.length === 0 && !isAdding ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.filter((c) => !c.hidden).length + 1}
                  className="h-24 text-center"
                >
                  <p className="text-muted-foreground">{noDataText}</p>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {useAddStartEntry && renderAddRow()}
                {paginatedItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className={editingId === item.id ? "bg-muted/50" : ""}
                  >
                    {tableColumns
                      .filter((column) => !column.hidden)
                      .map((column, index) => (
                        <TableCell
                          key={`${item.id}-${index}`}
                          className={cn(
                            column.isPinned &&
                              "sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                            editingId === item.id &&
                              column.isPinned &&
                              "bg-muted/50",
                            column.width && column.width,
                          )}
                          style={
                            column.width ? { width: column.width } : undefined
                          }
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSave();
                            }}
                            className="mr-2 h-8 w-8 text-green-600"
                            title={`Save (${SHORTCUTS.SAVE})`}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCancel();
                            }}
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className="mr-2 h-8 w-8"
                            title={`Edit (${SHORTCUTS.EDIT})`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteClick(item.id);
                            }}
                            className="h-8 w-8 text-red-600"
                            title={`Delete (${SHORTCUTS.DELETE})`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!useAddStartEntry && renderAddRow()}
              </>
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
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {getPageNumbers().map((page, i) => (
              <PaginationItem key={`page-${i}`}>
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
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default DataTable;
