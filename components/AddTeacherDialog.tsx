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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import departmentsData from "@/data/departmentsData.json";

interface AddTeacherDialogProps {
  trigger?: React.ReactNode;
  onSaveTeacher?: (teacher: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    phone?: string;
    subjects: string;
    profileImageUrl?: string;
    expirationDate: string;
  }) => void;
  editTeacher?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    phone?: string;
    subjects: string;
    profileImageUrl?: string;
    expirationDate: string;
  } | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AddTeacherDialog = ({
  trigger,
  onSaveTeacher,
  editTeacher,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: AddTeacherDialogProps) => {
  const getDefaultExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = React.useState({
    firstName: editTeacher?.firstName || "",
    lastName: editTeacher?.lastName || "",
    email: editTeacher?.email || "",
    department: editTeacher?.department || "",
    phone: editTeacher?.phone || "",
    subjects: editTeacher?.subjects || "",
    profileImageUrl: editTeacher?.profileImageUrl || "",
    expirationDate: editTeacher?.expirationDate || getDefaultExpirationDate(),
  });
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const isEditing = !!editTeacher;

  const departments = departmentsData.filter((dept) => dept.code !== "ALL");

  React.useEffect(() => {
    if (editTeacher) {
      setFormData({
        firstName: editTeacher.firstName,
        lastName: editTeacher.lastName,
        email: editTeacher.email,
        department: editTeacher.department,
        phone: editTeacher.phone || "",
        subjects: editTeacher.subjects,
        profileImageUrl: editTeacher.profileImageUrl || "",
        expirationDate: editTeacher.expirationDate,
      });
    }
  }, [editTeacher]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.subjects.trim()) {
      newErrors.subjects = "Subjects are required";
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = "Expiration date is required";
    } else {
      const selectedDate = new Date(formData.expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.expirationDate = "Expiration date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSaveTeacher?.(formData);
      if (!isEditing) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          department: "",
          phone: "",
          subjects: "",
          profileImageUrl: "",
          expirationDate: getDefaultExpirationDate(),
        });
      }
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
    if (open && !isEditing) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        phone: "",
        subjects: "",
        profileImageUrl: "",
        expirationDate: getDefaultExpirationDate(),
      });
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
              {isEditing ? "Edit Teacher" : "Add New Teacher"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the teacher details below."
                : "Add a new teacher to your institution. Fill in the details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name *</Label>
                <Input
                  id="first-name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="John"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <span className="text-sm text-red-500">
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name *</Label>
                <Input
                  id="last-name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Doe"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <span className="text-sm text-red-500">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john.doe@university.edu"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleInputChange("department", value)
                }
              >
                <SelectTrigger
                  className={errors.department ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.code}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <span className="text-sm text-red-500">
                  {errors.department}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subjects">Subjects *</Label>
              <Input
                id="subjects"
                value={formData.subjects}
                onChange={(e) => handleInputChange("subjects", e.target.value)}
                placeholder="e.g. Mathematics, Physics, Chemistry"
                className={errors.subjects ? "border-red-500" : ""}
              />
              {errors.subjects && (
                <span className="text-sm text-red-500">{errors.subjects}</span>
              )}
              <span className="text-xs text-muted-foreground">
                Separate multiple subjects with commas
              </span>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-image">
                Profile Image URL (Optional)
              </Label>
              <Input
                id="profile-image"
                value={formData.profileImageUrl}
                onChange={(e) =>
                  handleInputChange("profileImageUrl", e.target.value)
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiration-date">Expiration Date *</Label>
              <Input
                id="expiration-date"
                type="date"
                value={formData.expirationDate}
                onChange={(e) =>
                  handleInputChange("expirationDate", e.target.value)
                }
                className={errors.expirationDate ? "border-red-500" : ""}
              />
              {errors.expirationDate && (
                <span className="text-sm text-red-500">
                  {errors.expirationDate}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                Default: 7 days from today
              </span>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Update Teacher" : "Add Teacher"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
