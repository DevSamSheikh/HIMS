import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  label: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  onAddNew?: (name: string) => void;
  placeholder?: string;
  addNewLabel?: string;
  addNewTitle?: string;
  addNewDescription?: string;
  addNewInputLabel?: string;
  addNewButtonLabel?: string;
  required?: boolean;
  error?: string;
  className?: string;
  showSelectedLabel?: boolean;
  autoFocus?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onValueChange,
  onAddNew,
  placeholder = "Select an option",
  addNewLabel = "Add New",
  addNewTitle = "Add New Item",
  addNewDescription = "Enter the name of the new item",
  addNewInputLabel = "Name",
  addNewButtonLabel = "Add",
  required = false,
  error,
  className,
  showSelectedLabel = false,
  autoFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value);
    console.log("SearchableSelect value updated:", value);
  }, [value]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle adding a new item
  const handleAddNew = () => {
    if (onAddNew) {
      // If there's no title, just call onAddNew directly without showing dialog
      if (!addNewTitle) {
        onAddNew("");
        return;
      }

      // Otherwise, use the dialog input value
      if (newItemName.trim()) {
        onAddNew(newItemName.trim());
        setNewItemName("");
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: `${addNewLabel} added successfully`,
          duration: 3000,
        });
      }
    }
  };

  // Focus the search input when the dropdown opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Use setTimeout to ensure the input is in the DOM
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 0);
    } else {
      // Clear search when closing
      setSearchTerm("");
    }
  };

  // Handle search input change without losing focus
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Prevent the dropdown from closing when clicking in the search input
  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle value change
  const handleValueChange = (val: string) => {
    console.log("handleValueChange called with:", val);
    setInternalValue(val);
    // Clear search term
    setSearchTerm("");
    // Call the parent's onValueChange
    onValueChange(val);
  };

  const selectedOption = options.find((option) => option.id === internalValue);
  console.log(
    "Selected option:",
    selectedOption,
    "from options:",
    options,
    "with value:",
    internalValue,
  );

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="flex">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex w-full gap-2">
        <div className="w-full">
          <Select
            value={internalValue}
            onValueChange={handleValueChange}
            onOpenChange={handleOpenChange}
          >
            <SelectTrigger
              className={cn(
                "w-full",
                error ? "border-red-500 focus-visible:ring-red-500" : "",
              )}
              data-value={internalValue}
              autoFocus={autoFocus}
            >
              <SelectValue placeholder={placeholder}>
                {showSelectedLabel && selectedOption
                  ? selectedOption.name
                  : null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div
                className="flex items-center px-3 py-2 sticky top-0 bg-white z-10 dark:bg-gray-800"
                onClick={handleSearchClick}
              >
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No options found
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>

        {onAddNew && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              // If we're not using the dialog (no title), call onAddNew directly
              if (!addNewTitle) {
                onAddNew("");
              } else {
                setIsDialogOpen(true);
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        {onAddNew && addNewTitle && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{addNewTitle}</DialogTitle>
                <DialogDescription>{addNewDescription}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <Label htmlFor="newItemName">{addNewInputLabel}</Label>
                <Input
                  id="newItemName"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={`Enter ${addNewInputLabel.toLowerCase()}`}
                  autoFocus
                />
              </div>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddNew}
                  disabled={!newItemName.trim()}
                >
                  {addNewButtonLabel}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
