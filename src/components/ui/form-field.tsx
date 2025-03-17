import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  placeholder,
  disabled = false,
  min,
  max,
  step,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            type === "number"
              ? e.target.value
                ? parseFloat(e.target.value)
                : ""
              : e.target.value,
          )
        }
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={cn(error ? "border-red-500 focus-visible:ring-red-500" : "")}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
