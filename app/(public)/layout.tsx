import type { Metadata } from "next";
import { PublicNavbar } from "@/components/PublicNavbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  title: {
    default: "EduExamPortal - Online Exam Management Platform",
    template: "%s | EduExamPortal",
  },
  description:
    "EduExamPortal: Transform how your institution conducts exams with our comprehensive online exam platform. Support for MCQ, Short Answer, and Coding questions with 8+ programming languages, AI-powered proctoring, and instant grading.",
  keywords: [
    "EduExamPortal",
    "online exams",
    "exam platform",
    "educational technology",
    "proctoring",
    "mcq questions",
    "coding exams",
    "institution management",
    "online assessment",
    "exam management system",
    "monaco editor",
    "judge0",
    "auto grading",
    "exam proctoring",
    "multi-tenant exam platform",
  ],
  authors: [{ name: "Surjendu kar" }],
  creator: "EduExamPortal",
  publisher: "EduExamPortal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "EduExamPortal - Online Exam Management Platform",
    description:
      "Transform how your institution conducts exams with EduExamPortal. Comprehensive platform with MCQ, SAQ, and Coding questions, AI-powered proctoring, and 8+ programming languages support.",
    siteName: "EduExamPortal",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduExamPortal - Online Exam Management Platform",
    description:
      "Transform how your institution conducts exams with EduExamPortal. Support for MCQ, SAQ, Coding questions, AI-powered proctoring, and instant grading.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen">
        <PublicNavbar />
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
