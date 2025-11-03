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
interface Exam {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  institution_id?: string;
}

interface AddStudentDialogProps {
  trigger?: React.ReactNode;
  exams?: Exam[];
  departments?: Department[];
  onSaveStudent?: (student: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    selectedExam: string;
    expirationDate: string;
  }) => void;
  onSendInvitation?: (student: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    departmentId: string;
    examId: string;
    expirationDate: string;
  }) => Promise<{ success: boolean; error?: string }>;
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
  exams = [],
  departments = [],
  onSaveStudent,
  onSendInvitation,
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [activeDepartmentId, setActiveDepartmentId] = React.useState<string | null>(null);
  const [loadingDepartments, setLoadingDepartments] = React.useState(false);
  const [fetchedDepartments, setFetchedDepartments] = React.useState<Department[]>([]);
  const [loadingExams, setLoadingExams] = React.useState(false);
  const [filteredExams, setFilteredExams] = React.useState<Exam[]>([]);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const isEditing = !!editStudent;

  // Determine which departments to use: fetched or provided via props
  const departmentsToUse = fetchedDepartments.length > 0 ? fetchedDepartments : departments;

  // Determine which exams to use: filtered or provided via props
  const examsToUse = filteredExams.length > 0 ? filteredExams : exams;

  // Fetch active department and departments when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      const deptId = localStorage.getItem("activeDepartmentId");
      setActiveDepartmentId(deptId);

      // Only fetch departments if "All Departments" is selected or in edit mode
      if (deptId === "all" || isEditing) {
        fetchDepartments();
      }

      // Initialize exams based on active department
      if (deptId && deptId !== "all" && !isEditing) {
        // If a specific department is active, fetch its exams
        fetchExamsForDepartment(deptId);
      } else {
        // Otherwise, use exams from props
        setFilteredExams(exams);
      }
    }
  }, [isOpen, isEditing, exams]);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      // Get active institution from localStorage
      const activeInstitutionId = localStorage.getItem('activeInstitutionId');

      // Fetch departments from API
      const response = await fetch('/api/departments');
      const departmentsData: Department[] = await response.json();

      if (response.ok) {
        // Filter departments by institution if institution is selected
        let filteredDepartments: Department[] = [];
        if (activeInstitutionId) {
          filteredDepartments = departmentsData
            .filter((dept) => dept.institution_id === activeInstitutionId && dept.id !== "all")
            .map((dept) => ({
              id: dept.id,
              name: dept.name,
              code: dept.code
            }));
        } else {
          // If no institution selected, show all departments except "all"
          filteredDepartments = departmentsData
            .filter((dept) => dept.id !== "all")
            .map((dept) => ({
              id: dept.id,
              name: dept.name,
              code: dept.code
            }));
        }
        setFetchedDepartments(filteredDepartments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setFetchedDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchExamsForDepartment = async (departmentId: string) => {
    try {
      setLoadingExams(true);
      // Get active institution from localStorage
      const activeInstitutionId = localStorage.getItem('activeInstitutionId');

      // Build query params
      const params = new URLSearchParams();
      if (activeInstitutionId) {
        params.append('institutionId', activeInstitutionId);
      }
      if (departmentId && departmentId !== 'all') {
        params.append('departmentId', departmentId);
      }

      const queryString = params.toString();
      const examsUrl = `/api/exams${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(examsUrl);
      const examsData: Exam[] = await response.json();

      if (response.ok) {
        setFilteredExams(examsData);
      } else {
        console.error('Failed to fetch exams:', examsData);
        setFilteredExams([]);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setFilteredExams([]);
    } finally {
      setLoadingExams(false);
    }
  };

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

    // Only require department selection if "All Departments" is selected or in edit mode
    if ((activeDepartmentId === "all" || isEditing) && !formData.department) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Use activeDepartmentId if a specific department is selected (not "all")
      const departmentToUse = activeDepartmentId && activeDepartmentId !== "all" && !isEditing
        ? activeDepartmentId
        : formData.department;

      if (onSendInvitation) {
        // Use the new invitation API
        const result = await onSendInvitation({
          id: editStudent?.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          departmentId: departmentToUse,
          examId: formData.selectedExam,
          expirationDate: formData.expirationDate,
        });

        if (result.success) {
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
      } else {
        // Fallback to old method
        const submissionData = {
          ...formData,
          department: departmentToUse
        };
        onSaveStudent?.(submissionData);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // When department changes, fetch exams for that department
    if (field === "department" && value) {
      fetchExamsForDepartment(value);
      // Clear the selected exam since department changed
      setFormData((prev) => ({ ...prev, selectedExam: "" }));
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                {errors.lastName && (
                  <span className="text-sm text-red-500">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Second row: email, department (conditional) */}
            <div className={`grid ${activeDepartmentId === "all" || isEditing ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john.doe@university.edu"
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email}</span>
                )}
              </div>

              {(activeDepartmentId === "all" || isEditing) && (
                <div className="grid gap-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                    disabled={loadingDepartments || isSubmitting}
                  >
                    <SelectTrigger
                      className={`!w-full ${
                        errors.department ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder={loadingDepartments ? "Loading departments..." : "Select department"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingDepartments ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Loading departments...
                        </div>
                      ) : departmentsToUse.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No departments available
                        </div>
                      ) : (
                        departmentsToUse.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} {dept.code ? `(${dept.code})` : ''}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <span className="text-sm text-red-500">
                      {errors.department}
                    </span>
                  )}
                </div>
              )}
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
                  disabled={loadingExams || ((activeDepartmentId === "all" || isEditing) && !formData.department) || isSubmitting}
                >
                  <SelectTrigger
                    className={`!w-full ${
                      errors.selectedExam ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        loadingExams
                          ? "Loading exams..."
                          : ((activeDepartmentId === "all" || isEditing) && !formData.department)
                          ? "Select department first"
                          : "Choose an exam"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingExams ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Loading exams...
                      </div>
                    ) : examsToUse.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No exams available for this department
                      </div>
                    ) : (
                      examsToUse.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.title}
                        </SelectItem>
                      ))
                    )}
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
                  disabled={isSubmitting}
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
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending Invitation..." : isEditing ? "Update Student" : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
