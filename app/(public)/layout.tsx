import type { Metadata } from "next";
import { PublicNavbar } from "@/components/PublicNavbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  title: {
    default: "Online Exam Assignment Platform",
    template: "%s | Online Exam Assignment Platform",
  },
  description:
    "Transform how your institution conducts exams with our comprehensive online exam platform. Support for MCQ, Short Answer, and Coding questions with AI-powered proctoring.",
  keywords: [
    "online exams",
    "exam platform",
    "educational technology",
    "proctoring",
    "mcq",
    "coding exams",
    "institution management",
  ],
  authors: [{ name: "Online Exam Assignment Platform" }],
  creator: "Online Exam Assignment Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Online Exam Assignment Platform",
    description:
      "Transform how your institution conducts exams with our comprehensive online exam platform.",
    siteName: "Online Exam Assignment Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Exam Assignment Platform",
    description:
      "Transform how your institution conducts exams with our comprehensive online exam platform.",
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
