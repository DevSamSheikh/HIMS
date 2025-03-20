import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface MRNumberSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: MRNumberConfig) => void;
  currentSettings: MRNumberConfig;
}

export interface MRNumberConfig {
  prefix: string;
  useCustomPrefix: boolean;
  includeYear: boolean;
  digitCount: number;
  separator: string;
}

const MRNumberSettings: React.FC<MRNumberSettingsProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}) => {
  const [settings, setSettings] = useState<MRNumberConfig>(currentSettings);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>MR Number Settings</DialogTitle>
          <DialogDescription>
            Configure how Medical Record (MR) numbers are generated in the
            system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useCustomPrefix"
              checked={settings.useCustomPrefix}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  useCustomPrefix: checked as boolean,
                })
              }
            />
            <Label htmlFor="useCustomPrefix" className="font-normal">
              Use custom prefix
            </Label>
          </div>

          {settings.useCustomPrefix && (
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input
                id="prefix"
                value={settings.prefix}
                onChange={(e) =>
                  setSettings({ ...settings, prefix: e.target.value })
                }
                placeholder="e.g., CITY, HOSP"
              />
              <p className="text-xs text-muted-foreground">
                This prefix will be added to all MR numbers (e.g.,
                CITY-2023-0001)
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeYear"
              checked={settings.includeYear}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, includeYear: checked as boolean })
              }
            />
            <Label htmlFor="includeYear" className="font-normal">
              Include year in MR number
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="digitCount">Number of digits</Label>
            <Input
              id="digitCount"
              type="number"
              min={4}
              max={10}
              value={settings.digitCount}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  digitCount: parseInt(e.target.value) || 4,
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              The sequential number will be padded with zeros to this length
              (e.g., 0001, 00001)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="separator">Separator</Label>
            <Input
              id="separator"
              value={settings.separator}
              onChange={(e) =>
                setSettings({ ...settings, separator: e.target.value })
              }
              placeholder="-"
              maxLength={1}
            />
            <p className="text-xs text-muted-foreground">
              Character used to separate parts of the MR number (e.g.,
              MR-2023-0001)
            </p>
          </div>

          <div className="mt-2 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Preview:</p>
            <p className="text-sm mt-1">
              {settings.useCustomPrefix ? settings.prefix : "MR"}
              {settings.separator}
              {settings.includeYear
                ? `${new Date().getFullYear()}${settings.separator}`
                : ""}
              {"0".repeat(settings.digitCount - 1)}1
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MRNumberSettings;
