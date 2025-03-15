import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun, Check } from "lucide-react";

interface ThemeSettingsProps {
  onThemeChange?: (theme: "light" | "dark") => void;
  onModuleColorChange?: (moduleId: string, color: string) => void;
  currentTheme?: "light" | "dark";
  moduleColors?: Record<string, string>;
}

const ThemeSettings = ({
  onThemeChange = () => {},
  onModuleColorChange = () => {},
  currentTheme = "light",
  moduleColors = {
    patientManagement: "blue",
    appointments: "green",
    billing: "purple",
    administrative: "orange",
    moduleSelection: "teal",
  },
}: ThemeSettingsProps) => {
  const [theme, setTheme] = useState<"light" | "dark">(currentTheme);
  const [colors, setColors] = useState<Record<string, string>>(moduleColors);

  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handleColorChange = (moduleId: string, color: string) => {
    setColors((prev) => ({
      ...prev,
      [moduleId]: color,
    }));
    onModuleColorChange(moduleId, color);
  };

  const colorOptions = [
    { value: "blue", label: "Blue", bg: "bg-blue-500" },
    { value: "green", label: "Green", bg: "bg-green-500" },
    { value: "purple", label: "Purple", bg: "bg-purple-500" },
    { value: "orange", label: "Orange", bg: "bg-orange-500" },
    { value: "teal", label: "Teal", bg: "bg-teal-500" },
    { value: "red", label: "Red", bg: "bg-red-500" },
    { value: "indigo", label: "Indigo", bg: "bg-indigo-500" },
    { value: "pink", label: "Pink", bg: "bg-pink-500" },
  ];

  const modules = [
    { id: "patientManagement", name: "Patient Management" },
    { id: "appointments", name: "Appointments" },
    { id: "billing", name: "Billing" },
    { id: "administrative", name: "Administrative Tasks" },
    { id: "moduleSelection", name: "Module Selection & Pricing" },
  ];

  return (
    <Card className="w-full max-w-[500px] bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Customize the appearance of your HIMS dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mode">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mode">Display Mode</TabsTrigger>
            <TabsTrigger value="colors">Module Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="mode" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <Label htmlFor="theme-mode">Light / Dark Mode</Label>
              </div>
              <Switch
                id="theme-mode"
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
              <Moon className="h-5 w-5 text-blue-700 dark:text-blue-400" />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Preview</h3>
              <div
                className={cn(
                  "p-4 rounded-md border",
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200",
                )}
              >
                <p className="text-sm">
                  This is how your interface will appear in {theme} mode.
                </p>
                <div className="flex gap-2 mt-2">
                  <div
                    className={cn(
                      "px-3 py-1 text-xs rounded",
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100",
                    )}
                  >
                    Sample Button
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1 text-xs rounded",
                      theme === "dark" ? "bg-blue-600" : "bg-blue-500",
                    )}
                  >
                    Primary Action
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="pt-4">
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <Label className="text-sm font-medium">{module.name}</Label>
                  <RadioGroup
                    value={colors[module.id]}
                    onValueChange={(value) =>
                      handleColorChange(module.id, value)
                    }
                    className="grid grid-cols-4 gap-2"
                  >
                    {colorOptions.map((color) => (
                      <div key={color.value} className="relative">
                        <RadioGroupItem
                          value={color.value}
                          id={`${module.id}-${color.value}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`${module.id}-${color.value}`}
                          className={cn(
                            "flex h-10 w-full cursor-pointer items-center justify-center rounded-md border-2 p-1",
                            color.bg,
                            colors[module.id] === color.value
                              ? "border-black dark:border-white"
                              : "border-transparent",
                          )}
                        >
                          {colors[module.id] === color.value && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button variant="outline" className="mr-2">
            Reset to Default
          </Button>
          <Button>Apply Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
