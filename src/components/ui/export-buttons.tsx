import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, ChevronDown, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ExportOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ExportButtonsProps {
  onExport: (type: string) => void;
  options?: ExportOption[];
  label?: string;
  variant?:
    | "outline"
    | "default"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  buttonClassName?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExport,
  options = [
    { id: "pdf", label: "PDF", icon: <FileText className="mr-2 h-4 w-4" /> },
    {
      id: "excel",
      label: "Excel",
      icon: <FileSpreadsheet className="mr-2 h-4 w-4" />,
    },
  ],
  label = "Export",
  variant = "outline",
  size = "sm",
  className = "",
  buttonClassName = "",
}) => {
  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={cn(buttonClassName)}>
            {label} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex items-center">
            <Download className="mr-2 h-4 w-4" /> Export Options
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => onExport(option.id)}
            >
              {option.icon}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExportButtons;
