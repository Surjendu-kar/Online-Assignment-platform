"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import departmentsData from "@/data/departmentsData.json";
import examsData from "@/data/examsData.json";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordToggle } from "@/components/ui/password-toggle";

interface StudentInvitation {
  id: string;
  token: string;
  email: string;
  institutionName: string;
  department: string;
  assignedExam: string;
  invitedBy: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired";
}

interface StudentFormData {
  password: string;
  confirmPassword: string;
}

export default function StudentInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [invitation, setInvitation] = useState<StudentInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<StudentFormData>({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = departmentsData.filter((dept) => dept.code !== "ALL");

  useEffect(() => {
    const validateToken = async () => {
      try {
        setLoading(true);

        // Simulate API call to validate token
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock invitation data - replace with actual API call
        const mockInvitation: StudentInvitation = {
          id: "inv-456",
          token: token,
          email: "student@example.com",
          institutionName: "Stanford University",
          department: "CS",
          assignedExam: "exam-1",
          invitedBy: "John Smith",
          expiresAt: new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: "pending",
        };

        if (new Date(mockInvitation.expiresAt) < new Date()) {
          mockInvitation.status = "expired";
        }

        setInvitation(mockInvitation);
      } catch (err) {
        setError("Invalid or expired invitation token");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Simulate API call to accept invitation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Welcome! Your student account has been created successfully."
      );

      // Redirect to student dashboard or login
      router.push("/login?role=student&success=account-created");
    } catch (err) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getExamName = (examId: string) => {
    const exam = examsData.find((e) => e.id === examId);
    return exam ? exam.name : "Unknown Exam";
  };

  const getDepartmentName = (deptCode: string) => {
    const dept = departments.find((d) => d.code === deptCode);
    return dept ? dept.name : deptCode;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#020618] p-4">
        <div className="shadow-input w-full max-w-md rounded-none bg-white md:rounded-2xl md:p-8 p-4 dark:bg-[#0f172b]">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
            <p className="text-muted-foreground">Validating invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#020618] p-4">
        <div className="shadow-input w-full max-w-md rounded-none bg-white md:rounded-2xl md:p-8 p-4 dark:bg-[#0f172b]">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-red-600 text-center mb-6">{error}</p>
            <Button onClick={() => router.push("/login")} variant="outline">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (invitation.status === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#020618] p-4">
        <div className="shadow-input w-full max-w-md rounded-none bg-white md:rounded-2xl md:p-8 p-4 dark:bg-[#0f172b]">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-yellow-600 mb-4" />
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Invitation Expired
            </h2>
            <p className="text-yellow-700 text-center mb-6">
              This invitation has expired. Please contact your teacher or
              administrator for a new invitation.
            </p>
            <Button onClick={() => router.push("/login")} variant="outline">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#020618] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-input w-full max-w-2xl rounded-none bg-white md:rounded-2xl md:p-8 p-4 dark:bg-[#0f172b]"
      >
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              Welcome to {invitation.institutionName}
            </CardTitle>
            <CardDescription>
              You have been invited to join as a student in the{" "}
              {getDepartmentName(invitation.department)} department
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="space-y-1">
                <div>
                  Invitation for: <strong>{invitation.email}</strong>
                </div>
                <div>
                  Invited by: <strong>{invitation.invitedBy}</strong>
                </div>
                <div>
                  Assigned Exam:
                  <strong>{getExamName(invitation.assignedExam)}</strong>
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Create Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Create a strong password"
                    className={formErrors.password ? "border-red-500" : ""}
                  />
                  <PasswordToggle
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    hasValue={!!formData.password}
                  />
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                    className={
                      formErrors.confirmPassword ? "border-red-500" : ""
                    }
                  />
                  <PasswordToggle
                    showPassword={showConfirmPassword}
                    onToggle={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    hasValue={!!formData.confirmPassword}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="text-xs text-gray-500">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>At least 8 characters long</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Contains at least one number</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="!w-full"
                disabled={
                  submitting || !formData.password || !formData.confirmPassword
                }
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
