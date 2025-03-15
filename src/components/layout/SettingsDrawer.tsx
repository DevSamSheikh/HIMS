import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Maximize, Minimize, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
  onFontSizeChange?: (size: number) => void;
  onFontFamilyChange?: (font: string) => void;
  onColorPresetChange?: (preset: string) => void;
  onToggleFullscreen?: () => void;
}

const SettingsDrawer = ({
  open,
  onOpenChange,
  currentTheme = "light",
  onThemeChange = () => {},
  onFontSizeChange = () => {},
  onFontFamilyChange = () => {},
  onColorPresetChange = () => {},
  onToggleFullscreen = () => {},
}: SettingsDrawerProps) => {
  // Always use light theme
  const theme = "light";
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>("Inter");
  const [colorPreset, setColorPreset] = useState<string>("black");
  const [cssVarsApplied, setCssVarsApplied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // No theme toggle functionality needed

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    onFontSizeChange(value[0]);

    // Apply font size to the entire app
    document.documentElement.style.setProperty("--font-size", `${value[0]}px`);
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    onFontFamilyChange(value);

    // Apply font family to the entire app
    document.documentElement.style.setProperty("font-family", value);
    document.body.style.fontFamily = value;
  };

  const handleColorPresetChange = (value: string) => {
    setColorPreset(value);
    onColorPresetChange(value);

    // Apply color preset to CSS variables
    const selectedColor = colorOptions.find((color) => color.value === value);

    if (selectedColor) {
      // Update CSS variables based on the color and current theme
      updateCssVariables(value, theme);

      // Apply the color to all buttons with variant="default"
      const buttons = document.querySelectorAll('button[class*="bg-primary"]');
      buttons.forEach((button) => {
        // Force refresh the button styling
        button.classList.add("color-preset-applied");
      });

      // Apply to all inputs with focus states
      const inputs = document.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        input.classList.add("color-preset-applied");
      });

      // Apply to all cards and backgrounds
      const cards = document.querySelectorAll(
        ".bg-card, .bg-background, .bg-white",
      );
      cards.forEach((card) => {
        card.classList.add("color-preset-applied");
      });

      // Force refresh all components to apply theme changes
      const allElements = document.querySelectorAll(
        '[class*="bg-"], [class*="text-"], [class*="border-"], [class*="ring-"]',
      );
      allElements.forEach((el) => {
        el.classList.add("theme-refresh");
        setTimeout(() => el.classList.remove("theme-refresh"), 10);
      });

      setCssVarsApplied(true);
    }
  };

  const updateCssVariables = (
    colorName: string,
    currentTheme: "light" | "dark" = theme,
  ) => {
    // Apply the color preset class to body
    document.body.classList.remove(
      "preset-black",
      "preset-blue",
      "preset-green",
      "preset-purple",
      "preset-orange",
      "preset-teal",
      "preset-red",
      "preset-indigo",
      "preset-pink",
      "preset-yellow",
    );
    document.body.classList.add(`preset-${colorName}`);
    const root = document.documentElement;
    const colorMap: Record<
      string,
      { hue: number; saturation: string; lightness: Record<string, string> }
    > = {
      black: {
        hue: 0,
        saturation: "0%",
        lightness: {
          primary: "0%",
          ring: "0%",
          border: "0%",
          focus: "0%",
          accent: "0%",
        },
      },
      yellow: {
        hue: 48,
        saturation: "70%",
        lightness: {
          primary: "65%",
          ring: "55%",
          border: "60%",
          focus: "60%",
          accent: "65%",
        },
      },
      blue: {
        hue: 222.2,
        saturation: "40%",
        lightness: {
          primary: "65%",
          ring: "55%",
          border: "60%",
          focus: "60%",
          accent: "65%",
        },
      },
      green: {
        hue: 142.1,
        saturation: "50%",
        lightness: {
          primary: "60%",
          ring: "50%",
          border: "55%",
          focus: "55%",
          accent: "60%",
        },
      },
      purple: {
        hue: 262.1,
        saturation: "50%",
        lightness: {
          primary: "65%",
          ring: "55%",
          border: "60%",
          focus: "60%",
          accent: "65%",
        },
      },
      orange: {
        hue: 24.6,
        saturation: "60%",
        lightness: {
          primary: "65%",
          ring: "55%",
          border: "60%",
          focus: "60%",
          accent: "65%",
        },
      },
      teal: {
        hue: 173.4,
        saturation: "50%",
        lightness: {
          primary: "60%",
          ring: "50%",
          border: "55%",
          focus: "55%",
          accent: "60%",
        },
      },
      red: {
        hue: 0,
        saturation: "60%",
        lightness: {
          primary: "65%",
          ring: "55%",
          border: "60%",
          focus: "60%",
          accent: "65%",
        },
      },
      indigo: {
        hue: 226.5,
        saturation: "50%",
        lightness: {
          primary: "65%",
          ring: "55%",
          border: "60%",
          focus: "60%",
          accent: "65%",
        },
      },
      pink: {
        hue: 330.4,
        saturation: "50%",
        lightness: {
          primary: "65%",
          ring: "55%",
          border: "60%",
          focus: "60%",
          accent: "65%",
        },
      },
    };

    const color = colorMap[colorName] || colorMap.blue;

    // Update primary color
    root.style.setProperty(
      "--primary",
      `${color.hue} ${color.saturation} ${color.lightness.primary}`,
    );

    // Set appropriate foreground color based on theme
    if (currentTheme === "dark") {
      root.style.setProperty("--primary-foreground", "0 0% 100%");
    } else {
      root.style.setProperty("--primary-foreground", "210 40% 98%");
    }

    // Update all color-related CSS variables
    root.style.setProperty(
      "--ring",
      `${color.hue} ${color.saturation} ${color.lightness.ring}`,
    );
    // Keep the original border color
    // Don't update --border and --input variables to maintain gray borders
    root.style.setProperty(
      "--focus",
      `${color.hue} ${color.saturation} ${color.lightness.focus}`,
    );
    root.style.setProperty(
      "--accent",
      `${color.hue} ${color.saturation} ${color.lightness.accent}`,
    );
    root.style.setProperty("--accent-foreground", "210 40% 98%");

    // Adjust foreground colors based on theme
    if (currentTheme === "dark") {
      // Dark theme foreground colors
      root.style.setProperty("--background", "222.2 84% 4.9%");
      root.style.setProperty("--foreground", "210 40% 98%");

      root.style.setProperty("--card", "222.2 84% 4.9%");
      root.style.setProperty("--card-foreground", "210 40% 98%");

      root.style.setProperty("--popover", "222.2 84% 4.9%");
      root.style.setProperty("--popover-foreground", "210 40% 98%");

      // Fix primary foreground for dark mode
      root.style.setProperty("--primary-foreground", "0 0% 100%");

      root.style.setProperty("--secondary", "217.2 32.6% 17.5%");
      root.style.setProperty("--secondary-foreground", "210 40% 98%");

      root.style.setProperty("--muted", "217.2 32.6% 17.5%");
      root.style.setProperty("--muted-foreground", "215 20.2% 65.1%");

      root.style.setProperty("--accent", "217.2 32.6% 17.5%");
      root.style.setProperty("--accent-foreground", "210 40% 98%");

      root.style.setProperty("--destructive", "0 62.8% 30.6%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");

      root.style.setProperty("--border", "217.2 32.6% 17.5%");
      root.style.setProperty("--input", "217.2 32.6% 17.5%");
      root.style.setProperty("--ring", "212.7 26.8% 83.9%");
    } else {
      // Light theme foreground colors
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");

      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");

      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "222.2 84% 4.9%");

      root.style.setProperty("--primary-foreground", "210 40% 98%");

      root.style.setProperty("--secondary", "210 40% 96.1%");
      root.style.setProperty("--secondary-foreground", "222.2 47.4% 11.2%");

      root.style.setProperty("--muted", "210 40% 96.1%");
      root.style.setProperty("--muted-foreground", "215.4 16.3% 46.9%");

      root.style.setProperty("--accent", "210 40% 96.1%");
      root.style.setProperty("--accent-foreground", "222.2 47.4% 11.2%");

      root.style.setProperty("--destructive", "0 84.2% 60.2%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");

      root.style.setProperty("--border", "214.3 31.8% 91.4%");
      root.style.setProperty("--input", "214.3 31.8% 91.4%");
      root.style.setProperty("--ring", "222.2 84% 4.9%");
    }

    // Force refresh all components to apply theme changes
    setTimeout(() => {
      const allElements = document.querySelectorAll(
        '[class*="bg-"], [class*="text-"], [class*="border-"], [class*="ring-"]',
      );
      allElements.forEach((el) => {
        el.classList.add("theme-refresh");
        setTimeout(() => el.classList.remove("theme-refresh"), 10);
      });
    }, 50);

    // For black specifically, adjust foreground colors for better contrast
    if (colorName === "black") {
      root.style.setProperty("--primary-foreground", "0 0% 100%");
      root.style.setProperty("--accent-foreground", "0 0% 100%");
    }
  };

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
  ];

  const colorOptions = [
    { value: "black", label: "Black", bg: "bg-black" },
    { value: "blue", label: "Blue", bg: "bg-blue-500" },
    { value: "green", label: "Green", bg: "bg-green-500" },
    { value: "purple", label: "Purple", bg: "bg-purple-500" },
    { value: "orange", label: "Orange", bg: "bg-orange-500" },
    { value: "teal", label: "Teal", bg: "bg-teal-500" },
    { value: "red", label: "Red", bg: "bg-red-500" },
    { value: "indigo", label: "Indigo", bg: "bg-indigo-500" },
    { value: "pink", label: "Pink", bg: "bg-pink-500" },
    { value: "yellow", label: "Yellow", bg: "bg-yellow-500" },
  ];

  // Apply initial color preset and font when component mounts
  useEffect(() => {
    if (!cssVarsApplied) {
      // Always use light theme
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");

      // Apply initial color preset
      updateCssVariables(colorPreset, theme);
      document.body.classList.add(`preset-${colorPreset}`);

      // Apply initial font family
      document.documentElement.style.setProperty("font-family", fontFamily);
      document.body.style.fontFamily = fontFamily;

      // Apply font size
      document.documentElement.style.setProperty(
        "--font-size",
        `${fontSize}px`,
      );

      // Force refresh all components with primary colors
      const primaryElements = document.querySelectorAll(
        '[class*="bg-primary"], [class*="border-primary"], [class*="ring-primary"], [class*="text-primary"]',
      );
      primaryElements.forEach((el) => {
        el.classList.add("color-preset-applied");
        setTimeout(() => el.classList.remove("color-preset-applied"), 10);
      });

      setCssVarsApplied(true);
    }
  }, [colorPreset, fontFamily, fontSize, cssVarsApplied, theme]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <div className="w-full h-full">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>Settings</SheetTitle>
            </div>
            <SheetDescription>
              Customize your application experience
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 py-2">
            <Tabs defaultValue="appearance">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4 py-4">
                <div className="mb-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Screen Mode</h3>
                    <div className="flex items-center justify-center">
                      <Button
                        id="fullscreen"
                        variant="default"
                        className="h-14 w-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                        onClick={() => {
                          setIsFullscreen(!isFullscreen);
                          onToggleFullscreen();
                        }}
                      >
                        {isFullscreen ? (
                          <Minimize className="h-6 w-6" />
                        ) : (
                          <Maximize className="h-6 w-6" />
                        )}
                        <span>
                          {isFullscreen
                            ? "Exit Fullscreen"
                            : "Enter Fullscreen"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Preset</Label>
                  <RadioGroup
                    value={colorPreset}
                    onValueChange={handleColorPresetChange}
                    className="grid grid-cols-2 gap-3"
                  >
                    {colorOptions.map((color) => (
                      <div key={color.value} className="relative">
                        <RadioGroupItem
                          value={color.value}
                          id={`color-${color.value}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`color-${color.value}`}
                          className={cn(
                            "flex h-14 w-full cursor-pointer items-center justify-center rounded-md border-2 p-1 transition-all duration-200 hover:opacity-90",
                            color.bg,
                            colorPreset === color.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent bg-opacity-50",
                          )}
                        >
                          {colorPreset === color.value && (
                            <span className="h-3 w-3 rounded-full bg-white shadow-md" />
                          )}
                        </Label>
                        <span className="mt-1 block text-center text-xs font-medium">
                          {color.label}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                  </div>
                  <Slider
                    id="font-size"
                    min={12}
                    max={24}
                    step={1}
                    defaultValue={[fontSize]}
                    onValueChange={handleFontSizeChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={fontFamily}
                    onValueChange={handleFontFamilyChange}
                  >
                    <SelectTrigger id="font-family">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 border rounded-md">
                  <p
                    className={`text-base`}
                    style={{ fontFamily, fontSize: `${fontSize}px` }}
                  >
                    This is a preview of your selected font settings.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button className="w-full">Close</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
