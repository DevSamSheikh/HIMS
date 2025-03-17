import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import ExportButtons from "@/components/ui/export-buttons";

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
}

interface ItemTableProps {
  onAdd: () => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ onAdd, onEdit, onDelete }) => {
  const exportData = (type: "pdf" | "excel") => {
    // This is a placeholder function for export functionality
    // In a real implementation, you would generate and download the file
    console.log(`Exporting data as ${type}`);

    // Example implementation:
    // For PDF: Use a library like jsPDF
    // For Excel: Use a library like xlsx
    alert(
      `Exporting data as ${type}. This feature will be implemented with actual file generation.`,
    );
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [companyFilter, setCompanyFilter] = useState("all-companies");
  const [activeFilter, setActiveFilter] = useState("all");
  const [categorySearch, setCategorySearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  // Mock data for items
  const mockItems: Item[] = [
    {
      id: "1",
      itemCode: "PCM500",
      itemName: "Paracetamol 500mg",
      genericName: "Paracetamol",
      company: "1",
      companyName: "Pharma Co",
      category: "2",
      categoryName: "Pain Relief",
      isPack: true,
      packQty: 10,
      packSalePrice: 50,
      packPurchasePrice: 40,
      salePrice: 5,
      purchasePrice: 4,
      isActive: true,
    },
    {
      id: "2",
      itemCode: "AMX250",
      itemName: "Amoxicillin 250mg",
      genericName: "Amoxicillin",
      company: "2",
      companyName: "MediCorp",
      category: "1",
      categoryName: "Antibiotics",
      isPack: true,
      packQty: 12,
      packSalePrice: 120,
      packPurchasePrice: 96,
      salePrice: 10,
      purchasePrice: 8,
      isActive: true,
    },
    {
      id: "3",
      itemCode: "VTC",
      itemName: "Vitamin C 500mg",
      genericName: "Ascorbic Acid",
      company: "3",
      companyName: "HealthDrugs",
      category: "3",
      categoryName: "Vitamins",
      isPack: false,
      packQty: 30,
      packSalePrice: 150,
      packPurchasePrice: 120,
      salePrice: 5,
      purchasePrice: 4,
      isActive: false,
    },
  ];

  // Mock data for dropdowns
  const companies = [
    { id: "1", name: "Pharma Co" },
    { id: "2", name: "MediCorp" },
    { id: "3", name: "HealthDrugs" },
  ];

  const categories = [
    { id: "1", name: "Antibiotics" },
    { id: "2", name: "Pain Relief" },
    { id: "3", name: "Vitamins" },
  ];

  // Filtered lists for dropdowns
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(companySearch.toLowerCase()),
  );

  // Filter items based on search term and filters
  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all-categories"
        ? true
        : item.category === categoryFilter;
    const matchesCompany =
      companyFilter === "all-companies" ? true : item.company === companyFilter;
    const matchesActive =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
          ? item.isActive
          : !item.isActive;

    return matchesSearch && matchesCategory && matchesCompany && matchesActive;
  });

  // Real-time search effect
  useEffect(() => {
    // This would typically be where you'd make an API call for real-time search
    console.log("Searching for:", searchTerm);
    // In a real implementation, you might debounce this search
  }, [searchTerm]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pharmacy Items</CardTitle>
        <div className="flex gap-2">
          <ExportButtons onExport={exportData} />
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex items-center px-3 py-2 sticky top-0 bg-white">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex items-center px-3 py-2 sticky top-0 bg-white">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                />
              </div>
              <SelectItem value="all-companies">All Companies</SelectItem>
              {filteredCompanies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Generic Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Pack</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.itemCode}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.genericName}</TableCell>
                    <TableCell>{item.companyName}</TableCell>
                    <TableCell>{item.categoryName}</TableCell>
                    <TableCell>
                      {item.isPack ? `${item.packQty} units` : "Single"}
                    </TableCell>
                    <TableCell>
                      {item.isPack
                        ? `${item.packSalePrice} (${item.salePrice}/unit)`
                        : item.salePrice}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.isActive ? "default" : "secondary"}
                        className={
                          item.isActive ? "bg-green-500" : "bg-red-500"
                        }
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemTable;
