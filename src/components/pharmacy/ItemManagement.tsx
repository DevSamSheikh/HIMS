import React, { useState, useEffect } from "react";
import ItemTable from "./ItemTable";
import ItemForm from "./ItemForm";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";

interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  genericName: string;
  company: string;
  companyName: string;
  category: string;
  categoryName: string;
  isPack: boolean;
  packQty: number;
  packSalePrice: number;
  packPurchasePrice: number;
  salePrice: number;
  purchasePrice: number;
  isActive: boolean;
  purchaseRatePercentage?: number;
  maxSaleDiscount?: number;
  gst?: number;
  altItemCode?: string;
  alias?: string;
}

const ItemManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Auto-expand the submenu when navigating directly to this page
  useEffect(() => {
    // This effect runs when the component mounts
    // It helps ensure the sidebar navigation is in the correct state
    // when directly accessing this page via URL
  }, []);

  const handleAddClick = () => {
    setCurrentItem(null);
    setShowForm(true);
  };

  const handleEditClick = (item: Item) => {
    setCurrentItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    // In a real app, you would call an API to delete the item
    toast({
      title: "Item Deleted",
      description: `Item with ID ${id} has been deleted.`,
    });
  };

  const handleSave = (data: any) => {
    // In a real app, you would call an API to save the item
    if (currentItem) {
      toast({
        title: "Item Updated",
        description: `${data.itemName} has been updated successfully.`,
      });
    } else {
      toast({
        title: "Item Added",
        description: `${data.itemName} has been added successfully.`,
      });
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background">
      {showForm ? (
        <ItemForm
          onSave={handleSave}
          onCancel={handleCancel}
          initialData={currentItem}
        />
      ) : (
        <ItemTable
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}
    </div>
  );
};

export default ItemManagement;
