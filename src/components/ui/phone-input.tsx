import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  format: string;
  regex?: RegExp;
  minLength: number;
  maxLength: number;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

const countries: Country[] = [
  {
    name: "Afghanistan",
    code: "AF",
    dialCode: "+93",
    flag: "🇦🇫",
    format: "+93 ## ### ####",
    minLength: 9,
    maxLength: 9,
  },
  {
    name: "Albania",
    code: "AL",
    dialCode: "+355",
    flag: "🇦🇱",
    format: "+355 ## ### ####",
    minLength: 9,
    maxLength: 9,
  },
  {
    name: "India",
    code: "IN",
    dialCode: "+91",
    flag: "🇮🇳",
    format: "+91 ##### #####",
    minLength: 10,
    maxLength: 10,
  },
  {
    name: "Pakistan",
    code: "PK",
    dialCode: "+92",
    flag: "🇵🇰",
    format: "+92 ### ### ####",
    minLength: 10,
    maxLength: 10,
  },
  {
    name: "United Kingdom",
    code: "GB",
    dialCode: "+44",
    flag: "🇬🇧",
    format: "+44 #### ######",
    minLength: 10,
    maxLength: 10,
  },
  {
    name: "United States",
    code: "US",
    dialCode: "+1",
    flag: "🇺🇸",
    format: "+1 (###) ###-####",
    minLength: 10,
    maxLength: 10,
  },
  {
    name: "Canada",
    code: "CA",
    dialCode: "+1",
    flag: "🇨🇦",
    format: "+1 (###) ###-####",
    minLength: 10,
    maxLength: 10,
  },
  {
    name: "Australia",
    code: "AU",
    dialCode: "+61",
    flag: "🇦🇺",
    format: "+61 # #### ####",
    minLength: 9,
    maxLength: 9,
  },
  {
    name: "China",
    code: "CN",
    dialCode: "+86",
    flag: "🇨🇳",
    format: "+86 ### #### ####",
    minLength: 11,
    maxLength: 11,
  },
  {
    name: "Germany",
    code: "DE",
    dialCode: "+49",
    flag: "🇩🇪",
    format: "+49 ### #######",
    minLength: 10,
    maxLength: 11,
  },
  {
    name: "France",
    code: "FR",
    dialCode: "+33",
    flag: "🇫🇷",
    format: "+33 # ## ## ## ##",
    minLength: 9,
    maxLength: 9,
  },
  {
    name: "Japan",
    code: "JP",
    dialCode: "+81",
    flag: "🇯🇵",
    format: "+81 ## #### ####",
    minLength: 10,
    maxLength: 10,
  },
  {
    name: "Brazil",
    code: "BR",
    dialCode: "+55",
    flag: "🇧🇷",
    format: "+55 ## ##### ####",
    minLength: 10,
    maxLength: 11,
  },
  {
    name: "Russia",
    code: "RU",
    dialCode: "+7",
    flag: "🇷🇺",
    format: "+7 ### ### ## ##",
    minLength: 10,
    maxLength: 10,
  },
  {
    name: "South Africa",
    code: "ZA",
    dialCode: "+27",
    flag: "🇿🇦",
    format: "+27 ## ### ####",
    minLength: 9,
    maxLength: 9,
  },
];

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  placeholder = "Enter phone number",
  className,
  id = "phone",
  name = "phone",
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Set Pakistan (index 3) as the default country
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[3]);
  const [localValue, setLocalValue] = useState("");
  const [localError, setLocalError] = useState<string | undefined>(error);

  // Filter countries based on search query
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Initialize with dial code
  useEffect(() => {
    if (!value && selectedCountry) {
      setLocalValue(selectedCountry.dialCode + " ");
      onChange(selectedCountry.dialCode + " ");
    } else if (value) {
      setLocalValue(value);
      // Try to detect country from value
      detectCountryFromValue(value);
    }
  }, [selectedCountry.dialCode]);

  // Update local value when prop value changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
      detectCountryFromValue(value);
    }
  }, [value]);

  // Update error state when prop error changes
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const detectCountryFromValue = (phoneValue: string) => {
    if (!phoneValue) return;

    // Try to find a country that matches the dial code at the beginning of the phone number
    for (const country of countries) {
      if (phoneValue.startsWith(country.dialCode)) {
        setSelectedCountry(country);
        return;
      }
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);

    // Replace the dial code if it exists, or add it if it doesn't
    const phoneWithoutDialCode = localValue.replace(/^\+\d+\s?/, "");
    const newValue = country.dialCode + " " + phoneWithoutDialCode;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Ensure the dial code is always present
    if (!inputValue.startsWith(selectedCountry.dialCode)) {
      setLocalValue(selectedCountry.dialCode + " ");
      onChange(selectedCountry.dialCode + " ");
      return;
    }

    setLocalValue(inputValue);
    onChange(inputValue);

    // Validate the phone number
    validatePhoneNumber(inputValue);
  };

  const validatePhoneNumber = (phoneValue: string) => {
    // Extract the number part without the dial code
    const numberPart = phoneValue
      .substring(selectedCountry.dialCode.length)
      .replace(/\s+/g, "");

    // Check if the number part meets the country's length requirements
    if (numberPart.length > 0) {
      if (numberPart.length < selectedCountry.minLength) {
        setLocalError(
          `Phone number for ${selectedCountry.name} must be at least ${selectedCountry.minLength} digits`,
        );
      } else if (numberPart.length > selectedCountry.maxLength) {
        setLocalError(
          `Phone number for ${selectedCountry.name} must be at most ${selectedCountry.maxLength} digits`,
        );
      } else {
        setLocalError(undefined);
      }
    } else {
      setLocalError(undefined);
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
    validatePhoneNumber(localValue);
  };

  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={id} className="block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="flex">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[110px] justify-between border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0"
            >
              <span className="flex items-center gap-1 truncate">
                <span
                  className="text-lg"
                  style={{
                    fontFamily:
                      "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
                  }}
                >
                  {selectedCountry.flag}
                </span>
                <span className="text-xs">{selectedCountry.dialCode}</span>
              </span>
              <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-1">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className={cn(
                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      selectedCountry.code === country.code
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span
                      className="mr-2 text-lg"
                      style={{
                        fontFamily:
                          "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
                      }}
                    >
                      {country.flag}
                    </span>
                    <span>{country.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {country.dialCode}
                    </span>
                    {selectedCountry.code === country.code && (
                      <Check className="ml-1 h-4 w-4" />
                    )}
                  </div>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    No countries found
                  </div>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <Input
          id={id}
          name={name}
          type="tel"
          value={localValue}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "flex-1 rounded-l-none",
            localError ? "border-red-500 focus-visible:ring-red-500" : "",
            className,
          )}
          required={required}
        />
      </div>
      {localError && <p className="text-sm text-red-500 mt-1">{localError}</p>}
    </div>
  );
};

export { PhoneInput };
