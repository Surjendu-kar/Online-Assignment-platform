"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/animate-ui/components/radix/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DepartmentDialogProps {
  trigger?: React.ReactNode;
  onSaveDepartment?: (department: {
    name: string;
    code: string;
    description: string;
    institution_id?: string;
  }) => void;
  editDepartment?: {
    id: string;
    name: string;
    code: string;
    description?: string;
    institution_id?: string;
  } | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  institutionId?: string; // Add institutionId prop
}

export const DepartmentDialog = ({
  trigger,
  onSaveDepartment,
  editDepartment,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  institutionId, // Add institutionId prop
}: DepartmentDialogProps) => {
  const [formData, setFormData] = React.useState({
    name: editDepartment?.name || "",
    code: editDepartment?.code || "",
    description: editDepartment?.description || "",
  });
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const isEditing = !!editDepartment;

  // Update form data when editDepartment changes
  React.useEffect(() => {
    if (editDepartment) {
      setFormData({
        name: editDepartment.name,
        code: editDepartment.code,
        description: editDepartment.description || "",
      });
    } else {
      // Reset form when editDepartment is null (adding new department)
      setFormData({ name: "", code: "", description: "" });
    }
  }, [editDepartment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    }

    // Remove the validation for code being required
    // Code is now optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (onSaveDepartment) {
          // Include institution_id when saving
          onSaveDepartment({
            ...formData,
            institution_id: institutionId
          });
        }
        
        if (!isEditing) {
          setFormData({ name: "", code: "", description: "" });
        }
        setIsOpen(false);
      } catch (error) {
        console.error('Error saving department:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !isEditing) {
      // Reset form and errors when dialog opens for adding
      setFormData({ name: "", code: "", description: "" });
      setErrors({});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        from="bottom"
        showCloseButton={true}
        className="sm:max-w-[425px]"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Department" : "Add New Department"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the department details below."
                : "Add a new department to your institution. Fill in the details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="department-name">Department Name *</Label>
              <Input
                id="department-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g. Computer Science"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department-code">
                Department Code (Optional)
              </Label>
              <Input
                id="department-code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="e.g. CS"
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <span className="text-sm text-red-500">{errors.code}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department-description">
                Description (Optional)
              </Label>
              <Input
                id="department-description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of the department"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Update Department" : "Add Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};