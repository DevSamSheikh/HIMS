import { MRNumberConfig } from "@/components/settings/MRNumberSettings";

// Default MR Number configuration
export const defaultMRConfig: MRNumberConfig = {
  prefix: "MR",
  useCustomPrefix: false,
  includeYear: true,
  digitCount: 4,
  separator: "-",
};

// Get the current MR Number configuration from localStorage or use default
export const getMRConfig = (): MRNumberConfig => {
  const storedConfig = localStorage.getItem("mrNumberConfig");
  if (storedConfig) {
    return JSON.parse(storedConfig);
  }
  return defaultMRConfig;
};

// Save MR Number configuration to localStorage
export const saveMRConfig = (config: MRNumberConfig): void => {
  localStorage.setItem("mrNumberConfig", JSON.stringify(config));
};

// Generate a new MR Number based on the configuration
export const generateMRNumber = (lastNumber: number = 0): string => {
  const config = getMRConfig();
  const prefix = config.useCustomPrefix ? config.prefix : "MR";
  const year = config.includeYear ? new Date().getFullYear().toString() : "";
  const nextNumber = lastNumber + 1;
  const paddedNumber = nextNumber.toString().padStart(config.digitCount, "0");

  let mrNumber = prefix;

  if (year) {
    mrNumber += `${config.separator}${year}`;
  }

  mrNumber += `${config.separator}${paddedNumber}`;

  return mrNumber;
};

// Get the last used MR Number from localStorage
export const getLastMRNumber = (): number => {
  const lastNumber = localStorage.getItem("lastMRNumber");
  return lastNumber ? parseInt(lastNumber) : 0;
};

// Save the last used MR Number to localStorage
export const saveLastMRNumber = (number: number): void => {
  localStorage.setItem("lastMRNumber", number.toString());
};
