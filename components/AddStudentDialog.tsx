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
import examsData from "@/data/examsData.json";

interface AddStudentDialogProps {
  trigger?: React.ReactNode;
  onSaveStudent?: (student: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    selectedExam: string;
    expirationDate: string;
  }) => void;
  editStudent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    selectedExam: string;
    expirationDate: string;
  } | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AddStudentDialog = ({
  trigger,
  onSaveStudent,
  editStudent,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: AddStudentDialogProps) => {
  const getDefaultExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = React.useState({
    firstName: editStudent?.firstName || "",
    lastName: editStudent?.lastName || "",
    email: editStudent?.email || "",
    department: editStudent?.department || "",
    selectedExam: editStudent?.selectedExam || "",
    expirationDate: editStudent?.expirationDate || getDefaultExpirationDate(),
  });
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const isEditing = !!editStudent;

  const departments = departmentsData.filter((dept) => dept.code !== "ALL");

  React.useEffect(() => {
    if (editStudent) {
      setFormData({
        firstName: editStudent.firstName,
        lastName: editStudent.lastName,
        email: editStudent.email,
        department: editStudent.department,
        selectedExam: editStudent.selectedExam,
        expirationDate: editStudent.expirationDate,
      });
    }
  }, [editStudent]);

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

    if (!formData.selectedExam) {
      newErrors.selectedExam = "Exam selection is required";
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
      onSaveStudent?.(formData);
      if (!isEditing) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          department: "",
          selectedExam: "",
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
        selectedExam: "",
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
        className="sm:max-w-[655px]"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Student" : "Add New Student"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the student details below."
                : "Add a new student to your institution. Fill in the details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* First row: firstName, lastName */}
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

            {/* Second row: email, department */}
            <div className="grid grid-cols-2 gap-2">
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
                    className={`!w-full ${
                      errors.department ? "border-red-500" : ""
                    }`}
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
            </div>

            {/* Third row: select exam, expiration date */}
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="exam">Select Exam *</Label>
                <Select
                  value={formData.selectedExam}
                  onValueChange={(value) =>
                    handleInputChange("selectedExam", value)
                  }
                >
                  <SelectTrigger
                    className={`!w-full ${
                      errors.selectedExam ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Choose an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examsData.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedExam && (
                  <span className="text-sm text-red-500">
                    {errors.selectedExam}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="expiration-date">Expiration Date *</Label>
                  <span className="text-xs text-muted-foreground">
                    Default: 2 days from today
                  </span>
                </div>
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
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Update Student" : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
