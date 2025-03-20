// Get the current date in YYYYMMDD format
const getCurrentDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// Get the last token number from localStorage
export const getLastTokenNumber = (): number => {
  const currentDate = getCurrentDateString();
  const lastTokenData = localStorage.getItem("lastTokenData");

  if (lastTokenData) {
    const data = JSON.parse(lastTokenData);
    // Reset counter if it's a new day
    if (data.date === currentDate) {
      return data.number;
    }
  }

  // If it's a new day or no data exists, reset to 0
  return 0;
};

// Save the last token number to localStorage
export const saveLastTokenNumber = (number: number): void => {
  const currentDate = getCurrentDateString();
  localStorage.setItem(
    "lastTokenData",
    JSON.stringify({
      date: currentDate,
      number: number,
    }),
  );
};

// Generate a new token number
export const generateTokenNumber = (): string => {
  const currentDate = getCurrentDateString();
  const lastNumber = getLastTokenNumber();
  const newNumber = lastNumber + 1;

  // Save the new number
  saveLastTokenNumber(newNumber);

  // Format: T-YYYYMMDD-001
  return `T-${currentDate}-${String(newNumber).padStart(3, "0")}`;
};

// Generate a token for a specific department
export const generateDepartmentToken = (departmentCode: string): string => {
  const currentDate = getCurrentDateString();
  const storageKey = `lastTokenData_${departmentCode}`;

  let lastNumber = 0;
  const lastTokenData = localStorage.getItem(storageKey);

  if (lastTokenData) {
    const data = JSON.parse(lastTokenData);
    if (data.date === currentDate) {
      lastNumber = data.number;
    }
  }

  const newNumber = lastNumber + 1;

  // Save the new number
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      date: currentDate,
      number: newNumber,
    }),
  );

  // Format: DEPT-YYYYMMDD-001
  return `${departmentCode}-${currentDate}-${String(newNumber).padStart(3, "0")}`;
};
