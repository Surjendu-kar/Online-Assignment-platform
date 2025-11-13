"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserCog,
  BookOpen,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Check,
  Play,
  Shield,
  BarChart3,
  FileEdit,
  Users,
  Settings,
  Mail,
  ClipboardList,
  Award,
  Code,
  Eye,
  TrendingUp,
  X,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

// Type definitions
type Screenshot = {
  url: string;
  description: string;
};

type Page = {
  name: string;
  path: string;
  screenshots: Screenshot[];
};

type Feature = {
  category: string;
  icon: LucideIcon;
  items: string[];
};

type RoleData = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  features: Feature[];
  pages: Page[];
  screenshot: string;
};

type RoleKey = "admin" | "teacher" | "student";

type LightboxData = {
  screenshots: Screenshot[];
  currentIndex: number;
  pageName: string;
};

// Demo data for each role
const roleData: Record<RoleKey, RoleData> = {
  admin: {
    title: "Admin Dashboard",
    subtitle: "Complete control and oversight of your institution",
    icon: UserCog,
    color: "from-blue-500 to-cyan-500",
    features: [
      {
        category: "Institution Management",
        icon: Users,
        items: [
          "Create and manage multiple institutions",
          "Organize departments hierarchically",
          "Role-based access control",
          "User invitation system",
        ],
      },
      {
        category: "Analytics & Reporting",
        icon: BarChart3,
        items: [
          "Platform-wide statistics",
          "Performance analytics",
          "Usage reports and insights",
          "Custom report generation",
        ],
      },
      {
        category: "Communications",
        icon: Mail,
        items: [
          "System-wide announcements",
          "Notification management",
          "Teacher invitations",
          "Bulk messaging",
        ],
      },
      {
        category: "Settings & Security",
        icon: Settings,
        items: [
          "System configuration",
          "Security settings",
          "Backup & restore",
          "Permission management",
        ],
      },
    ],
    pages: [
      {
        name: "Dashboard Overview",
        path: "/admin",
        screenshots: [], // No screenshots available yet
      },
      {
        name: "Manage Teachers",
        path: "/admin/management/teachers",
        screenshots: [
          {
            url: "/admin/management/teacher_management.webp",
            description:
              "Teachers List - View all teachers, their status, created exams, and invited students",
          },
          {
            url: "/admin/management/addTeacher.webp",
            description:
              "Invite New Teacher - Fill in teacher details and assign department",
          },
          {
            url: "/admin/management/viewTeacher.webp",
            description:
              "Teacher Details - View complete teacher profile with edit and delete options",
          },
        ],
      },
      {
        name: "Manage Students",
        path: "/admin/management/students",
        screenshots: [
          {
            url: "/admin/management/student_management.webp",
            description:
              "Students List - View all student invitations and their exam assignments",
          },
          {
            url: "/admin/management/addStudent.webp",
            description:
              "Invite New Student - Add student details and assign to specific exams",
          },
          {
            url: "/admin/management/viewStudent.webp",
            description:
              "Student Details - View student information and exam enrollments",
          },
        ],
      },
      {
        name: "Manage Exams",
        path: "/admin/management/exams",
        screenshots: [
          {
            url: "/admin/management/exam_management.webp",
            description:
              "Exams List - Overview of all exams with status, duration, and question counts",
          },
          {
            url: "/admin/management/addExam1.webp",
            description:
              "Create Exam - Step 1: Basic exam information and settings",
          },
          {
            url: "/admin/management/addExam2.webp",
            description:
              "Create Exam - Step 2: Add and configure exam questions",
          },
          {
            url: "/admin/management/addExam3.webp",
            description:
              "Create Exam - Step 3: Review and finalize exam creation",
          },
        ],
      },
    ],
    screenshot: "/Admin_page.webp",
  },
  teacher: {
    title: "Teacher Dashboard",
    subtitle: "Create, manage, and grade exams efficiently",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    features: [
      {
        category: "Exam Creation",
        icon: FileEdit,
        items: [
          "Multi-question type support (MCQ, SAQ, Coding)",
          "Question bank and templates",
          "Randomization options",
          "Time and schedule control",
        ],
      },
      {
        category: "Student Management",
        icon: Users,
        items: [
          "Email-based invitations",
          "Bulk student operations",
          "Access control per exam",
          "Student performance tracking",
        ],
      },
      {
        category: "Grading & Feedback",
        icon: Award,
        items: [
          "Auto-grading for MCQs",
          "Manual grading interface",
          "Code execution testing",
          "Detailed feedback system",
        ],
      },
      {
        category: "Proctoring & Security",
        icon: Shield,
        items: [
          "Real-time monitoring",
          "Violation tracking",
          "Webcam requirements",
          "Tab switching detection",
        ],
      },
    ],
    pages: [
      {
        name: "Dashboard Overview",
        path: "/teacher",
        screenshots: [], // Coming Soon
      },
      {
        name: "Manage Students",
        path: "/teacher/management/students",
        screenshots: [
          {
            url: "/teacher/management/student.webp",
            description:
              "My Students - View all students you've invited to exams",
          },
          {
            url: "/teacher/management/addStudent.webp",
            description: "Invite Students - Send exam invitations via email",
          },
          {
            url: "/teacher/management/viewStudent.webp",
            description:
              "Student Details - View student information and exam performance",
          },
        ],
      },
      {
        name: "Manage Exams",
        path: "/teacher/management/exams",
        screenshots: [
          {
            url: "/teacher/management/exam.webp",
            description:
              "My Exams - Manage all your created exams and their settings",
          },
          {
            url: "/teacher/management/addExam.webp",
            description:
              "Create New Exam - Step 1: Set exam title, duration, and proctoring options",
          },
          {
            url: "/teacher/management/addExam2.webp",
            description:
              "Create New Exam - Step 2: Add MCQ, SAQ, and coding questions",
          },
          {
            url: "/teacher/management/addExam3.webp",
            description:
              "Create New Exam - Step 3: Review exam and publish to students",
          },
        ],
      },
    ],
    screenshot: "/Teacher_page.webp",
  },
  student: {
    title: "Student Dashboard",
    subtitle: "Take exams with a seamless, secure experience",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
    features: [
      {
        category: "Exam Experience",
        icon: ClipboardList,
        items: [
          "Clean, distraction-free interface",
          "Real-time countdown timer",
          "Progress tracking",
          "Auto-save functionality",
        ],
      },
      {
        category: "Question Types",
        icon: FileEdit,
        items: [
          "Multiple Choice Questions (MCQ)",
          "Short Answer Questions (SAQ)",
          "Coding challenges with editor",
          "Mixed question formats",
        ],
      },
      {
        category: "Code Editor",
        icon: Code,
        items: [
          "Monaco editor with syntax highlighting",
          "Multi-language support",
          "Real-time code testing",
          "Starter code templates",
        ],
      },
      {
        category: "Results & Feedback",
        icon: TrendingUp,
        items: [
          "Instant MCQ results",
          "Detailed performance analytics",
          "Teacher feedback access",
          "Score breakdowns",
        ],
      },
    ],
    pages: [
      {
        name: "Dashboard Overview",
        path: "/student",
        screenshots: [
          {
            url: "/student/dashboard.webp",
            description:
              "Student Dashboard - View upcoming exams and your exam history",
          },
        ],
      },
      {
        name: "My Exams & Take Exam",
        path: "/student/exams",
        screenshots: [
          {
            url: "/student/exam.webp",
            description:
              "Exams List - View all your assigned exams with status filters (All, Pending, Completed, Expired)",
          },
          {
            url: "/student/overview.webp",
            description:
              "Exam Overview - View exam instructions, duration, and requirements before starting",
          },
          {
            url: "/student/questions.webp",
            description:
              "Exam Questions - Answer MCQ, SAQ, and coding questions with real-time timer",
          },
          {
            url: "/student/submit.webp",
            description:
              "Submit Exam - Review your answers and submit the exam",
          },
        ],
      },
      {
        name: "View Results",
        path: "/student/results",
        screenshots: [
          {
            url: "/student/result.webp",
            description:
              "Exam Results - View your scores, feedback, and performance analytics",
          },
        ],
      },
    ],
    screenshot: "/student/dashboard.webp",
  },
};

export default function DemoPage() {
  const [activeRole, setActiveRole] = useState<RoleKey>("admin");
  const [screenshotIndices, setScreenshotIndices] = useState<
    Record<number, number>
  >({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<LightboxData | null>(null);
  const [direction, setDirection] = useState(0);

  const currentRole = roleData[activeRole];
  const Icon = currentRole.icon;

  const handleNextScreenshot = (
    pageIndex: number,
    totalScreenshots: number
  ) => {
    setScreenshotIndices((prev) => ({
      ...prev,
      [pageIndex]: ((prev[pageIndex] || 0) + 1) % totalScreenshots,
    }));
  };

  const handlePrevScreenshot = (
    pageIndex: number,
    totalScreenshots: number
  ) => {
    setScreenshotIndices((prev) => ({
      ...prev,
      [pageIndex]:
        ((prev[pageIndex] || 0) - 1 + totalScreenshots) % totalScreenshots,
    }));
  };

  const openLightbox = (
    screenshots: Screenshot[],
    currentIndex: number,
    pageName: string
  ) => {
    setLightboxData({ screenshots, currentIndex, pageName });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxData(null);
  };

  const nextLightboxImage = () => {
    if (lightboxData) {
      setDirection(1);
      setLightboxData({
        ...lightboxData,
        currentIndex:
          (lightboxData.currentIndex + 1) % lightboxData.screenshots.length,
      });
    }
  };

  const prevLightboxImage = () => {
    if (lightboxData) {
      setDirection(-1);
      setLightboxData({
        ...lightboxData,
        currentIndex:
          (lightboxData.currentIndex - 1 + lightboxData.screenshots.length) %
          lightboxData.screenshots.length,
      });
    }
  };

  // Reset screenshot indices when role changes
  React.useEffect(() => {
    setScreenshotIndices({});
  }, [activeRole]);

  // Handle keyboard navigation for lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        nextLightboxImage();
      } else if (e.key === "ArrowLeft") {
        prevLightboxImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, lightboxData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020618]">
      <div className="container mx-auto px-4 max-w-7xl pt-60 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Experience the
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Platform
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore how our exam management system works for different user
            roles
          </p>
        </motion.div>

        {/* Role Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {(Object.entries(roleData) as [RoleKey, RoleData][]).map(
            ([role, data]) => {
              const RoleIcon = data.icon;
              const isActive = activeRole === role;

              return (
                <motion.button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-3 px-8 py-4 rounded-xl border-2 transition-all duration-300 text-lg font-semibold",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <RoleIcon className="w-6 h-6" />
                  <span className="capitalize">{role}</span>
                </motion.button>
              );
            }
          )}
        </div>

        {/* Role Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Role Header */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {currentRole.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {currentRole.subtitle}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentRole.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FeatureIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3">
                          {feature.category}
                        </h3>
                        <ul className="space-y-2">
                          {feature.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Page Previews */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Eye className="w-6 h-6 text-primary" />
                Platform Pages Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRole.pages.map((page, index) => {
                  const currentScreenshotIndex = screenshotIndices[index] || 0;
                  const hasScreenshots =
                    page.screenshots && page.screenshots.length > 0;
                  const hasMultipleScreenshots =
                    page.screenshots && page.screenshots.length > 1;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div
                        className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden border border-border group-hover:border-primary/50 transition-all duration-300 cursor-pointer"
                        onClick={() =>
                          hasScreenshots &&
                          openLightbox(
                            page.screenshots,
                            currentScreenshotIndex,
                            page.name
                          )
                        }
                      >
                        {hasScreenshots ? (
                          <>
                            <Image
                              src={page.screenshots[currentScreenshotIndex].url}
                              alt={
                                page.screenshots[currentScreenshotIndex]
                                  .description
                              }
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Zoom Icon */}
                            <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <ZoomIn className="w-5 h-5" />
                            </div>
                            {/* Navigation Arrows */}
                            {hasMultipleScreenshots && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevScreenshot(
                                      index,
                                      page.screenshots.length
                                    );
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                  aria-label="Previous screenshot"
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextScreenshot(
                                      index,
                                      page.screenshots.length
                                    );
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                  aria-label="Next screenshot"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                                {/* Screenshot Indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {currentScreenshotIndex + 1} /{" "}
                                  {page.screenshots.length}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-4">
                              <Eye className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Coming Soon
                              </p>
                            </div>
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                      <div className="mt-3 text-center">
                        <p className="font-medium text-sm">{page.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {page.path}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && lightboxData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute cursor-pointer top-15 right-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-50"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Title */}
            <div
              className="absolute top-4 left-4 bg-black/50 text-white px-6 py-3 rounded-lg z-50 max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-semibold text-lg mb-1">
                {
                  lightboxData.screenshots[lightboxData.currentIndex]
                    .description
                }
              </p>
              {lightboxData.screenshots.length > 1 && (
                <p className="text-sm text-gray-300">
                  Screenshot {lightboxData.currentIndex + 1} of{" "}
                  {lightboxData.screenshots.length}
                </p>
              )}
            </div>

            {/* Image Container - centered */}
            <div className="absolute top-20 inset-0 flex items-center justify-center p-4 overflow-hidden pointer-events-none">
              <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                <AnimatePresence initial={false} mode="wait" custom={direction}>
                  <motion.div
                    key={lightboxData.currentIndex}
                    custom={direction}
                    initial={{
                      x: direction > 0 ? 1000 : -1000,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                    }}
                    exit={{
                      x: direction > 0 ? -1000 : 1000,
                      opacity: 0,
                    }}
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="relative w-full h-full pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={
                        lightboxData.screenshots[lightboxData.currentIndex].url
                      }
                      alt={
                        lightboxData.screenshots[lightboxData.currentIndex]
                          .description
                      }
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation Arrows - Outside Image */}
            {lightboxData.screenshots.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevLightboxImage();
                  }}
                  className="absolute cursor-pointer left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-50"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLightboxImage();
                  }}
                  className="absolute cursor-pointer right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-50"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Bottom Instructions */}
            {/* <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm z-50 pointer-events-none"
            >
              <span className="hidden md:inline">
                Use arrow keys to navigate • Press ESC or click outside to close
              </span>
              <span className="md:hidden">
                Tap arrows to navigate • Tap outside to close
              </span>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
