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

interface AddInstitutionDialogProps {
  trigger?: React.ReactNode;
  onAddInstitution?: (institution: {
    name: string;
    type: string;
    logo: string;
  }) => void;
}

export const AddInstitutionDialog = ({
  trigger,
  onAddInstitution,
}: AddInstitutionDialogProps) => {
  const [formData, setFormData] = React.useState({
    name: "",
    type: "",
    logo: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = React.useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Institution name is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Institution type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddInstitution?.(formData);
      setFormData({ name: "", type: "", logo: "" });
      setIsOpen(false);
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
    if (open) {
      // Reset form and errors when dialog opens
      setFormData({ name: "", type: "", logo: "" });
      setErrors({});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Add Institution</Button>}
      </DialogTrigger>
      <DialogContent
        from="bottom"
        showCloseButton={true}
        className="sm:max-w-[425px]"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Institution</DialogTitle>
            <DialogDescription>
              Add a new institution to your platform. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="institution-name">Institution Name *</Label>
              <Input
                id="institution-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g. Stanford University"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-type">Institution Type *</Label>
              <Input
                id="institution-type"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                placeholder="e.g. Computer Science Department"
                className={errors.type ? "border-red-500" : ""}
              />
              {errors.type && (
                <span className="text-sm text-red-500">{errors.type}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-logo">Logo URL (Optional)</Label>
              <Input
                id="institution-logo"
                value={formData.logo}
                onChange={(e) => handleInputChange("logo", e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add Institution</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
