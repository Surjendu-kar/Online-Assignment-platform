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

interface InstitutionDialogProps {
  trigger?: React.ReactNode;
  onSaveInstitution?: (institution: {
    name: string;
    description: string;
  }) => void;
  editInstitution?: {
    id: string;
    name: string;
    description?: string;
  } | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const InstitutionDialog = ({
  trigger,
  onSaveInstitution,
  editInstitution,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: InstitutionDialogProps) => {
  const [formData, setFormData] = React.useState({
    name: editInstitution?.name || "",
    description: editInstitution?.description || "",
  });
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const isEditing = !!editInstitution;

  // Update form data when editInstitution changes
  React.useEffect(() => {
    if (editInstitution) {
      setFormData({
        name: editInstitution.name,
        description: editInstitution.description || "",
      });
    } else {
      // Reset form when editInstitution is null (adding new institution)
      setFormData({ name: "", description: "" });
    }
  }, [editInstitution]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Institution name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (onSaveInstitution) {
          onSaveInstitution({
            ...formData,
          });
        }
        
        if (!isEditing) {
          setFormData({ name: "", description: "" });
        }
        setIsOpen(false);
      } catch (error) {
        console.error('Error saving institution:', error);
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
      setFormData({ name: "", description: "" });
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
              {isEditing ? "Edit Institution" : "Add New Institution"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the institution details below."
                : "Add a new institution. Fill in the details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="institution-name">Institution Name *</Label>
              <Input
                id="institution-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g. ABC High School"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-description">
                Description (Optional)
              </Label>
              <Input
                id="institution-description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of the institution"
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
              {isEditing ? "Update Institution" : "Add Institution"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};