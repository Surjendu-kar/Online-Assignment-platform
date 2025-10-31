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
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
} from "@/components/animate-ui/primitives/radix/radio-group";
import { QuestionAccordion } from "@/components/QuestionAccordion";
import { ExamDialogSkeleton } from "@/components/ExamDialogSkeleton";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Question {
  id: string;
  type: "mcq" | "saq" | "coding";
  question: string;
  points: number;
  options?: string[];
  correctAnswer?: number;
  gradingGuidelines?: string;
  programmingLanguage?: string;
  testCases?: { input: string; output: string }[];
  codeTemplate?: string;
  order?: number;
}

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  institution_id?: string;
}

interface AddExamDialogProps {
  trigger?: React.ReactNode;
  onSaveExam?: (examData: {
    name: string;
    startDate: string;
    endDate: string;
    duration: number;
    status: "draft" | "active" | "archived";
    questions: Question[];
    departmentId?: string;
    institutionId?: string;
  }) => void;
  editExam?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    duration: number;
    status: "draft" | "active" | "archived";
    questions: Question[];
    departmentId?: string;
    institutionId?: string;
  } | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  isEditMode?: boolean;
}

export const AddExamDialog = ({
  trigger,
  onSaveExam,
  editExam,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  loading = false,
  isEditMode = false,
}: AddExamDialogProps) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Get user role and active department from localStorage
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [activeDepartmentId, setActiveDepartmentId] = React.useState<
    string | null
  >(null);
  const [activeInstitutionId, setActiveInstitutionId] = React.useState<
    string | null
  >(null);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = React.useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] =
    React.useState<string>("");

  // Step 1 form data
  const [step1Data, setStep1Data] = React.useState({
    name: editExam?.name || "",
    startDate: editExam?.startDate || "",
    endDate: editExam?.endDate || "",
    duration: editExam?.duration || 60,
    status: editExam?.status || "draft",
  });

  // Step 2 form data
  const [questions, setQuestions] = React.useState<Question[]>(
    editExam?.questions || []
  );
  const [currentQuestionType, setCurrentQuestionType] = React.useState<
    "mcq" | "saq" | "coding"
  >("mcq");
  const [currentQuestion, setCurrentQuestion] = React.useState<
    Partial<Question>
  >({});
  const [editingQuestionId, setEditingQuestionId] = React.useState<
    string | null
  >(null);
  const [showQuestionForm, setShowQuestionForm] = React.useState(
    editExam?.questions?.length === 0 || !editExam
  );
  const [openAccordionId, setOpenAccordionId] = React.useState<string | null>(
    null
  );
  const [isDeleteMode, setIsDeleteMode] = React.useState(false);
  const [selectedQuestions, setSelectedQuestions] = React.useState<Set<string>>(
    new Set()
  );
  const [newlyAddedQuestionId, setNewlyAddedQuestionId] = React.useState<
    string | null
  >(null);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;
  const isEditing = !!editExam;

  const programmingLanguages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C",
    "C#",
    "Go",
    "Rust",
    "TypeScript",
  ];

  // Fetch departments for admin when "All Departments" is selected
  const fetchDepartments = React.useCallback(async (institutionId: string) => {
    try {
      setLoadingDepartments(true);
      const response = await fetch("/api/departments");
      const data = await response.json();

      if (response.ok) {
        // Filter by institution
        const filteredDepts = data.filter(
          (dept: Department) => dept.institution_id === institutionId
        );
        setDepartments(filteredDepts);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingDepartments(false);
    }
  }, []);

  // Fetch user role and active selections when dialog opens
  React.useEffect(() => {
    if (!isOpen) return;

    const role = localStorage.getItem("userRole")?.toLowerCase() || null;
    const deptId = localStorage.getItem("activeDepartmentId");
    const instId = localStorage.getItem("activeInstitutionId");

    setUserRole(role);
    setActiveDepartmentId(deptId);
    setActiveInstitutionId(instId);

    // If admin and ("All Departments" is selected OR in edit mode), fetch departments
    if (role === "admin" && (deptId === "all" || isEditMode) && instId) {
      fetchDepartments(instId);
    }
  }, [isOpen, fetchDepartments, isEditMode]);

  React.useEffect(() => {
    if (editExam) {
      setStep1Data({
        name: editExam.name,
        startDate: editExam.startDate,
        endDate: editExam.endDate,
        duration: editExam.duration,
        status: editExam.status,
      });
      setQuestions(editExam.questions || []);
      // Set the selected department if editing
      if (editExam.departmentId) {
        setSelectedDepartmentId(editExam.departmentId);
      }
      // Show question form if there are no questions, otherwise hide it
      setShowQuestionForm((editExam.questions || []).length === 0);
    } else {
      // Reset to default values when creating new exam
      setStep1Data({
        name: "",
        startDate: "",
        endDate: "",
        duration: 60,
        status: "draft",
      });
      setQuestions([]);
      setSelectedDepartmentId("");
      setShowQuestionForm(true);
      setCurrentStep(1);
      setErrors({});
      setCurrentQuestion({});
      setEditingQuestionId(null);
    }
  }, [editExam]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!step1Data.name.trim()) {
      newErrors.name = "Exam name is required";
    }

    if (!step1Data.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!step1Data.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (step1Data.startDate && step1Data.endDate) {
      const startDate = new Date(step1Data.startDate);
      const endDate = new Date(step1Data.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (!step1Data.duration || step1Data.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Change = (field: string, value: string | number) => {
    setStep1Data((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const handleReorderQuestions = (reorderedQuestions: Question[]) => {
    setQuestions(reorderedQuestions);
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedQuestions(new Set());
  };

  const toggleQuestionSelection = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const deleteSelectedQuestions = () => {
    const updatedQuestions = questions.filter(
      (q) => !selectedQuestions.has(q.id)
    );
    updatedQuestions.forEach((q, i) => {
      q.order = i + 1;
    });
    setQuestions(updatedQuestions);
    setSelectedQuestions(new Set());
    setIsDeleteMode(false);
  };

  const resetQuestionForm = () => {
    setCurrentQuestion({});
    setEditingQuestionId(null);
    setShowQuestionForm(false);
  };

  const handleQuestionTypeChange = (type: "mcq" | "saq" | "coding") => {
    setCurrentQuestionType(type);
    setCurrentQuestion({ type });
  };

  const handleAddQuestion = () => {
    const questionData: Question = {
      id: editingQuestionId || Date.now().toString(),
      type: currentQuestionType,
      question: currentQuestion.question || "",
      points: currentQuestion.points || 1,
    };

    if (currentQuestionType === "mcq") {
      questionData.options = currentQuestion.options || ["", "", "", ""];
      questionData.correctAnswer = currentQuestion.correctAnswer || 0;
    } else if (currentQuestionType === "saq") {
      questionData.gradingGuidelines = currentQuestion.gradingGuidelines || "";
    } else if (currentQuestionType === "coding") {
      questionData.programmingLanguage =
        currentQuestion.programmingLanguage || "";
      questionData.testCases = currentQuestion.testCases || [];
      questionData.codeTemplate = currentQuestion.codeTemplate || "";
    }

    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestionId ? questionData : q))
      );
    } else {
      setQuestions((prev) => [...prev, questionData]);
      setNewlyAddedQuestionId(questionData.id);
      setTimeout(() => {
        setNewlyAddedQuestionId(null);
      }, 350);
    }

    resetQuestionForm();
  };

  const handleEditQuestion = (question: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? question : q))
    );
  };

  const handleAccordionToggle = (questionId: string) => {
    setOpenAccordionId(openAccordionId === questionId ? null : questionId);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleAddTestCase = () => {
    const testCases = currentQuestion.testCases || [];
    setCurrentQuestion((prev) => ({
      ...prev,
      testCases: [...testCases, { input: "", output: "" }],
    }));
  };

  const handleTestCaseChange = (
    index: number,
    field: "input" | "output",
    value: string
  ) => {
    const testCases = [...(currentQuestion.testCases || [])];
    testCases[index] = { ...testCases[index], [field]: value };
    setCurrentQuestion((prev) => ({ ...prev, testCases }));
  };

  const handleRemoveTestCase = (index: number) => {
    const testCases = currentQuestion.testCases || [];
    setCurrentQuestion((prev) => ({
      ...prev,
      testCases: testCases.filter((_, i) => i !== index),
    }));
  };

  const handleSaveExam = () => {
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    // Determine department and institution IDs
    let finalDepartmentId: string | undefined;
    let finalInstitutionId: string | undefined;

    // Priority: Edit mode > All Departments > Specific Department
    if (userRole === "admin" && isEditMode) {
      // EDIT MODE: Always require department selection from dropdown
      if (!selectedDepartmentId) {
        alert("Please select a department");
        return;
      }
      finalDepartmentId = selectedDepartmentId;
      finalInstitutionId = activeInstitutionId || undefined;
    } else if (userRole === "admin" && activeDepartmentId === "all") {
      // CREATE MODE with "All Departments" - use selected department from dropdown
      if (!selectedDepartmentId) {
        alert("Please select a department");
        return;
      }
      finalDepartmentId = selectedDepartmentId;
      finalInstitutionId = activeInstitutionId || undefined;
    } else if (
      userRole === "admin" &&
      activeDepartmentId &&
      activeDepartmentId !== "all"
    ) {
      // CREATE MODE with specific department selected
      finalDepartmentId = activeDepartmentId;
      finalInstitutionId = activeInstitutionId || undefined;
    } else if (userRole === "teacher") {
      // Teacher - use their assigned department (backend will handle this)
      finalDepartmentId = undefined; // Let backend use teacher's department
      finalInstitutionId = undefined; // Let backend use teacher's institution
    }

    onSaveExam?.({
      ...step1Data,
      questions,
      departmentId: finalDepartmentId,
      institutionId: finalInstitutionId,
    });

    // Reset form
    setStep1Data({
      name: "",
      startDate: "",
      endDate: "",
      duration: 60,
      status: "draft",
    });
    setQuestions([]);
    setSelectedDepartmentId("");
    setCurrentStep(1);
    resetQuestionForm();
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !isEditing) {
      setStep1Data({
        name: "",
        startDate: "",
        endDate: "",
        duration: 60,
        status: "draft",
      });
      setQuestions([]);
      setCurrentStep(1);
      resetQuestionForm();
      setErrors({});
    }
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <>
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
          margin: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 3px;
          margin: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        .scrollbar-thin {
          scrollbar-gutter: stable;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent
          from="bottom"
          showCloseButton={true}
          layoutId="exam-dialog"
          className={
            currentStep === 1
              ? "sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
              : "sm:max-w-[850px] max-h-[90vh] overflow-y-auto"
          }
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing || isEditMode ? "Edit Exam" : "Create New Exam"} - Step{" "}
              {currentStep} of 2
            </DialogTitle>
            <DialogDescription>
              {currentStep === 1
                ? "Set up the basic exam details"
                : "Add and manage questions for your exam"}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <ExamDialogSkeleton />
          ) : (
            <>
              {currentStep === 1 && (
                <div className="grid gap-4 py-4">
                  {/* Conditional Layout Based on Department Field Visibility */}
                  {userRole === "admin" && (isEditMode || activeDepartmentId === "all") ? (
                    // Show Department Field - Use 3-column layout
                    <>
                      {/* First row: Exam Name (full width) */}
                      <div className="grid gap-2">
                        <Label htmlFor="exam-name">Exam Name *</Label>
                        <Input
                          id="exam-name"
                          value={step1Data.name}
                          onChange={(e) =>
                            handleStep1Change("name", e.target.value)
                          }
                          placeholder="Enter exam name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <span className="text-sm text-red-500">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Second row: Duration and Department */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duration (minutes) *</Label>
                          <Input
                            id="duration"
                            type="number"
                            min={1}
                            value={step1Data.duration}
                            onChange={(e) =>
                              setStep1Data((prev) => ({
                                ...prev,
                                duration: Number(e.target.value),
                              }))
                            }
                            placeholder="60"
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="department">Department *</Label>
                          <Select
                            value={selectedDepartmentId}
                            onValueChange={(value) => {
                              setSelectedDepartmentId(value);
                            }}
                            disabled={loadingDepartments}
                          >
                            <SelectTrigger
                              id="department"
                              className="w-full h-[40px]"
                              size="lg"
                            >
                              <SelectValue
                                placeholder={
                                  loadingDepartments
                                    ? "Loading departments..."
                                    : "Select department"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.length === 0 && !loadingDepartments ? (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  No departments available
                                </div>
                              ) : (
                                departments.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.id}>
                                    {dept.name}{" "}
                                    {dept.description && `(${dept.description})`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Hide Department Field - Use 2-column layout for Name and Duration
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-2">
                        <Label htmlFor="exam-name">Exam Name *</Label>
                        <Input
                          id="exam-name"
                          value={step1Data.name}
                          onChange={(e) =>
                            handleStep1Change("name", e.target.value)
                          }
                          placeholder="Enter exam name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <span className="text-sm text-red-500">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration (minutes) *</Label>
                        <Input
                          id="duration"
                          type="number"
                          min={1}
                          value={step1Data.duration}
                          onChange={(e) =>
                            setStep1Data((prev) => ({
                              ...prev,
                              duration: Number(e.target.value),
                            }))
                          }
                          placeholder="60"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Second row: Start Date and End Date */}
                  <div className="grid grid-cols-3 gap-10">
                    <div className="grid gap-2">
                      <Label htmlFor="start-date">Start Date *</Label>
                      <Input
                        id="start-date"
                        type="datetime-local"
                        value={step1Data.startDate}
                        onChange={(e) =>
                          handleStep1Change("startDate", e.target.value)
                        }
                        className={errors.startDate ? "border-red-500" : ""}
                      />
                      {errors.startDate && (
                        <span className="text-sm text-red-500">
                          {errors.startDate}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="end-date">End Date *</Label>
                      <Input
                        id="end-date"
                        type="datetime-local"
                        value={step1Data.endDate}
                        onChange={(e) =>
                          handleStep1Change("endDate", e.target.value)
                        }
                        className={errors.endDate ? "border-red-500" : ""}
                      />
                      {errors.endDate && (
                        <span className="text-sm text-red-500">
                          {errors.endDate}
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={step1Data.status}
                        onValueChange={(value) =>
                          setStep1Data((prev) => ({
                            ...prev,
                            status: value as "active" | "draft" | "archived",
                          }))
                        }
                      >
                        <SelectTrigger
                          id="status"
                          className="w-full h-[40px]"
                          size="lg"
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 h-[450px] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                    {/* Left Side - Question Controls (1/3 width) */}
                    <div className="space-y-4 h-fit">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Type
                        </Label>
                        <Select
                          value={currentQuestionType}
                          onValueChange={(value: "mcq" | "saq" | "coding") =>
                            handleQuestionTypeChange(value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcq">
                              Multiple Choice (MCQ)
                            </SelectItem>
                            <SelectItem value="saq">
                              Short Answer (SAQ)
                            </SelectItem>
                            <SelectItem value="coding">
                              Coding Challenge
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={() => setShowQuestionForm(!showQuestionForm)}
                        className="w-full"
                        variant={showQuestionForm ? "outline" : "default"}
                      >
                        {showQuestionForm
                          ? "Cancel"
                          : `Add ${currentQuestionType.toUpperCase()} Question`}
                      </Button>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Marks
                        </Label>
                        <Input
                          type="number"
                          value={totalMarks}
                          disabled
                          className="w-full bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Right Side - Question Form and Accordion (2/3 width) */}
                    <div className="col-span-2 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-3">
                      {showQuestionForm ? (
                        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                          {currentQuestionType === "mcq" && (
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Enter question text..."
                                value={currentQuestion.question || ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    question: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="w-full"
                              />
                              <RadioGroup
                                value={
                                  currentQuestion.correctAnswer?.toString() ||
                                  "0"
                                }
                                onValueChange={(value: string) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    correctAnswer: parseInt(value),
                                  }))
                                }
                                className="grid grid-cols-2 gap-3"
                              >
                                {[0, 1, 2, 3].map((index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <Input
                                      placeholder={`Option ${index + 1}`}
                                      value={
                                        currentQuestion.options?.[index] || ""
                                      }
                                      onChange={(e) => {
                                        const options = [
                                          ...(currentQuestion.options || [
                                            "",
                                            "",
                                            "",
                                            "",
                                          ]),
                                        ];
                                        options[index] = e.target.value;
                                        setCurrentQuestion((prev) => ({
                                          ...prev,
                                          options,
                                        }));
                                      }}
                                      className="flex-1"
                                    />
                                    <RadioGroupItem
                                      value={index.toString()}
                                      id={`option-${index}`}
                                      className="size-5 rounded-full flex items-center justify-center border"
                                    >
                                      <RadioGroupIndicator className="size-3 bg-primary rounded-full" />
                                    </RadioGroupItem>
                                  </div>
                                ))}
                              </RadioGroup>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                placeholder="Points"
                                value={currentQuestion.points || 1}
                                onChange={(e) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    points: parseInt(e.target.value) || 1,
                                  }))
                                }
                                className="w-full"
                              />
                            </div>
                          )}

                          {currentQuestionType === "saq" && (
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Enter question text..."
                                value={currentQuestion.question || ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    question: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="w-full"
                              />
                              <Textarea
                                placeholder="Grading guidelines (optional)..."
                                value={currentQuestion.gradingGuidelines || ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    gradingGuidelines: e.target.value,
                                  }))
                                }
                                rows={2}
                                className="w-full"
                              />
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                placeholder="Points"
                                value={currentQuestion.points || 1}
                                onChange={(e) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    points: parseInt(e.target.value) || 1,
                                  }))
                                }
                                className="w-full"
                              />
                            </div>
                          )}

                          {currentQuestionType === "coding" && (
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Enter question text..."
                                value={currentQuestion.question || ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    question: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="w-full"
                              />
                              <Select
                                value={
                                  currentQuestion.programmingLanguage || ""
                                }
                                onValueChange={(value) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    programmingLanguage: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select programming language" />
                                </SelectTrigger>
                                <SelectContent>
                                  {programmingLanguages.map((lang) => (
                                    <SelectItem key={lang} value={lang}>
                                      {lang}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Textarea
                                placeholder="Starter code (optional)..."
                                value={currentQuestion.codeTemplate || ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    codeTemplate: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="w-full font-mono"
                              />
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <Label>Test Cases</Label>
                                  <Button
                                    type="button"
                                    onClick={handleAddTestCase}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add Test Case
                                  </Button>
                                </div>
                                {currentQuestion.testCases?.map(
                                  (testCase, index) => (
                                    <div
                                      key={index}
                                      className="grid grid-cols-2 gap-2 p-2 border rounded"
                                    >
                                      <div className="grid gap-1">
                                        <Label className="text-xs">Input</Label>
                                        <Textarea
                                          value={testCase.input}
                                          onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                          ) =>
                                            handleTestCaseChange(
                                              index,
                                              "input",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Input data..."
                                          rows={2}
                                        />
                                      </div>
                                      <div className="grid gap-1">
                                        <Label className="text-xs">
                                          Expected Output
                                        </Label>
                                        <div className="flex gap-1">
                                          <Textarea
                                            value={testCase.output}
                                            onChange={(
                                              e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) =>
                                              handleTestCaseChange(
                                                index,
                                                "output",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Expected output..."
                                            rows={2}
                                            className="flex-1"
                                          />
                                          <Button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveTestCase(index)
                                            }
                                            size="sm"
                                            variant="outline"
                                            className="self-start"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                placeholder="Points"
                                value={currentQuestion.points || 1}
                                onChange={(e) =>
                                  setCurrentQuestion((prev) => ({
                                    ...prev,
                                    points: parseInt(e.target.value) || 1,
                                  }))
                                }
                                className="w-full"
                              />
                            </div>
                          )}

                          <Button
                            onClick={handleAddQuestion}
                            className="w-full"
                            disabled={!currentQuestion.question?.trim()}
                          >
                            {editingQuestionId
                              ? "Update Question"
                              : `Add ${currentQuestionType.toUpperCase()} Question`}
                          </Button>
                          {editingQuestionId && (
                            <Button
                              type="button"
                              onClick={resetQuestionForm}
                              variant="outline"
                              className="w-full"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      ) : (
                        <QuestionAccordion
                          questions={questions}
                          openAccordionId={openAccordionId}
                          onAccordionToggle={handleAccordionToggle}
                          onEditQuestion={handleEditQuestion}
                          onDeleteQuestion={handleDeleteQuestion}
                          onReorderQuestions={handleReorderQuestions}
                          isDeleteMode={isDeleteMode}
                          selectedQuestions={selectedQuestions}
                          onToggleSelection={toggleQuestionSelection}
                          onToggleDeleteMode={toggleDeleteMode}
                          onDeleteSelected={deleteSelectedQuestions}
                          newlyAddedQuestionId={newlyAddedQuestionId}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                {currentStep === 1 ? (
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={handleNextStep}
                      disabled={
                        !step1Data.name ||
                        !step1Data.startDate ||
                        !step1Data.endDate ||
                        !step1Data.duration
                      }
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-end">
                    <Button onClick={handleBackStep} variant="outline">
                      <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <Button onClick={handleSaveExam}>Save</Button>
                  </div>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
