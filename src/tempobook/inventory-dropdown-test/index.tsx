import React from "react";
import InventoryOpeningForm from "@/components/pharmacy/InventoryOpeningForm";

export default function InventoryDropdownTest() {
  const handleSave = (data: any) => {
    console.log("Form data saved:", data);
  };

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  const handlePrint = (data: any) => {
    console.log("Print data:", data);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Inventory Opening Form Test</h1>
      <InventoryOpeningForm
        onSave={handleSave}
        onCancel={handleCancel}
        onPrint={handlePrint}
      />
    </div>
  );
}
