"use client";

import React from "react";
import { motion } from "motion/react";
import FeatureCategoryCard from "./FeatureCategoryCard";
import UseCasesSection from "./UseCasesSection";
import ScreenshotsGallery from "./ScreenshotsGallery";
import {
  FileEdit,
  Shield,
  Building2,
  Trophy,
  GraduationCap,
  BookOpen,
  Code,
  Clock,
  Eye,
  UserCheck,
  CheckCircle2,
  BarChart3,
  Layout,
  Timer,
  Target,
  Users,
  Workflow,
  Mail,
  FileSpreadsheet,
} from "lucide-react";

const featureCategories = [
  {
    title: "Exam Management",
    icon: FileEdit,
    color: "from-blue-500 to-cyan-500",
    features: [
      {
        icon: CheckCircle2,
        title: "Multi-Question Types",
        description:
          "Support for Multiple Choice Questions (MCQ), Short Answer Questions (SAQ), and Coding challenges in a single exam.",
      },
      {
        icon: BookOpen,
        title: "Question Banks & Templates",
        description:
          "Create reusable question templates and build comprehensive question banks for efficient exam creation.",
      },
      {
        icon: Clock,
        title: "Exam Scheduling & Duration Control",
        description:
          "Schedule exams with specific start and end times, set duration limits, and configure time zones automatically.",
      },
      {
        icon: Workflow,
        title: "Randomization Options",
        description:
          "Randomize question order and answer options to ensure exam integrity and prevent cheating.",
      },
    ],
  },
  {
    title: "Proctoring & Security",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
    features: [
      {
        icon: Eye,
        title: "Webcam Monitoring",
        description:
          "Real-time webcam monitoring ensures students are present and focused throughout the exam duration.",
      },
      {
        icon: Target,
        title: "Violation Tracking",
        description:
          "Automatic detection and logging of suspicious behavior with configurable violation thresholds.",
      },
      {
        icon: Layout,
        title: "Tab Switching Detection",
        description:
          "Monitor and log when students switch browser tabs or leave the exam window during assessment.",
      },
      {
        icon: UserCheck,
        title: "Face Detection",
        description:
          "AI-powered face detection ensures the registered student is taking the exam throughout the session.",
      },
    ],
  },
  {
    title: "Institution Management",
    icon: Building2,
    color: "from-green-500 to-emerald-500",
    features: [
      {
        icon: Building2,
        title: "Multi-Institution Support",
        description:
          "Manage multiple educational institutions with isolated data and independent administrative controls.",
      },
      {
        icon: Workflow,
        title: "Department Hierarchy",
        description:
          "Organize institutions into departments with hierarchical access control and management structure.",
      },
      {
        icon: Shield,
        title: "Role-Based Access Control",
        description:
          "Granular permissions system with Admin, Teacher, and Student roles ensuring secure data access.",
      },
      {
        icon: Users,
        title: "User Invitation System",
        description:
          "Email-based invitation system for onboarding teachers and students with secure token validation.",
      },
    ],
  },
  {
    title: "Grading & Results",
    icon: Trophy,
    color: "from-orange-500 to-red-500",
    features: [
      {
        icon: CheckCircle2,
        title: "Auto-Grading for MCQs",
        description:
          "Instant automatic grading for multiple-choice questions with immediate result availability.",
      },
      {
        icon: FileEdit,
        title: "Manual Grading Interface",
        description:
          "Intuitive interface for teachers to review and grade short answer questions with feedback options.",
      },
      {
        icon: Code,
        title: "Coding Test Execution",
        description:
          "Integrated Judge0 API for executing and testing code submissions in multiple programming languages.",
      },
      {
        icon: BarChart3,
        title: "Result Analytics",
        description:
          "Comprehensive analytics dashboard showing performance trends, score distributions, and insights.",
      },
    ],
  },
  {
    title: "Student Experience",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-500",
    features: [
      {
        icon: Layout,
        title: "Intuitive Exam Interface",
        description:
          "Clean, distraction-free interface designed for optimal focus during exam-taking experience.",
      },
      {
        icon: Code,
        title: "Code Editor with Syntax Highlighting",
        description:
          "Monaco editor with syntax highlighting, code completion, and multi-language support for coding questions.",
      },
      {
        icon: Timer,
        title: "Real-Time Timer",
        description:
          "Prominent countdown timer with visual and audio alerts as exam time approaches deadline.",
      },
      {
        icon: Target,
        title: "Progress Tracking",
        description:
          "Visual progress indicator showing answered, unanswered, and flagged questions at a glance.",
      },
    ],
  },
  {
    title: "Teacher Tools",
    icon: BookOpen,
    color: "from-pink-500 to-rose-500",
    features: [
      {
        icon: Workflow,
        title: "Exam Creation Wizard",
        description:
          "Step-by-step wizard guiding teachers through exam setup, question addition, and configuration.",
      },
      {
        icon: BookOpen,
        title: "Question Library",
        description:
          "Personal question library for storing and reusing questions across multiple exams and semesters.",
      },
      {
        icon: Users,
        title: "Student Management",
        description:
          "Complete student roster management with invitation tracking, access control, and performance overview.",
      },
      {
        icon: Trophy,
        title: "Grade Management",
        description:
          "Centralized grading dashboard with bulk actions, export options, and customizable grading rubrics.",
      },
    ],
  },
];

const integrations = [
  {
    icon: Code,
    title: "Judge0 API",
    description:
      "Powerful code execution engine supporting JavaScript, Python, Java, C++, C, Ruby, Go, and Rust with secure sandboxed execution.",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    description:
      "Automated email system for exam invitations, result notifications, and password resets using Nodemailer.",
  },
  {
    icon: FileSpreadsheet,
    title: "Export Capabilities",
    description:
      "Export exam results, student performance data, and analytics reports in CSV and Excel formats (coming soon).",
  },
];

export default function DetailedFeaturesSection() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-20 md:pt-62 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Powerful Features for <br />
              Modern Education
            </h1>
            <p className="text-muted-foreground text-md md:text-lg max-w-3xl mx-auto mb-8">
              Everything you need to create, deliver, and grade comprehensive
              online exams with security, efficiency, and ease.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-24">
            {featureCategories.map((category, index) => (
              <FeatureCategoryCard
                key={index}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Screenshots Gallery */}
      <ScreenshotsGallery />

      {/* Integrations Section */}
      <section className="w-full py-20 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Powerful Integrations
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              Seamlessly integrated with industry-leading tools and services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                >
                  <div className="relative h-full rounded-2xl p-8 bg-card border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-4 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {integration.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
