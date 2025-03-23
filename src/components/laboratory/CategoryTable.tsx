import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import CategoryForm from "./CategoryForm";

interface Category {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
}

const CategoryTable = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Mock data for categories
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "category-001",
      name: "Hematology",
      description: "Blood-related tests and analyses",
      status: "active",
    },
    {
      id: "category-002",
      name: "Biochemistry",
      description: "Tests related to biochemical processes and substances",
      status: "active",
    },
    {
      id: "category-003",
      name: "Microbiology",
      description: "Tests related to microorganisms and infections",
      status: "active",
    },
    {
      id: "category-004",
      name: "Serology",
      description: "Tests related to serum components and antibodies",
      status: "active",
    },
    {
      id: "category-005",
      name: "Endocrinology",
      description: "Tests related to hormones and endocrine system",
      status: "active",
    },
    {
      id: "category-006",
      name: "Immunology",
      description: "Tests related to immune system and responses",
      status: "active",
    },
    {
      id: "category-007",
      name: "Histopathology",
      description: "Examination of tissue samples for disease diagnosis",
      status: "active",
    },
    {
      id: "category-008",
      name: "Cytology",
      description: "Examination of cells for disease diagnosis",
      status: "active",
    },
    {
      id: "category-009",
      name: "Molecular Biology",
      description: "Tests related to DNA, RNA, and genetic analysis",
      status: "active",
    },
  ]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsAddDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveCategory = (category: Category) => {
    if (selectedCategory) {
      // Update existing category
      setCategories(
        categories.map((c) => (c.id === category.id ? category : c)),
      );
    } else {
      // Add new category
      setCategories([...categories, category]);
    }
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      setCategories(categories.filter((c) => c.id !== selectedCategory.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Test Categories</h2>
          <p className="text-muted-foreground">
            Manage laboratory test categories
          </p>
        </div>
        <Button onClick={handleAddCategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"}`}
                    >
                      {category.status.charAt(0).toUpperCase() +
                        category.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <CategoryForm
            onSave={handleSaveCategory}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <CategoryForm
            category={selectedCategory || undefined}
            onSave={handleSaveCategory}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "
              {selectedCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryTable;
