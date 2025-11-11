import { Metadata } from "next";
import DetailedFeaturesSection from "@/components/features/DetailedFeaturesSection";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Features | Online Exam Assignment Platform",
  description:
    "Discover powerful features for modern education: Multi-question types, AI-powered proctoring, institution management, real-time grading, and more.",
  openGraph: {
    title: "Features | Online Exam Assignment Platform",
    description:
      "Comprehensive exam platform with MCQ, SAQ, and coding questions, proctoring, and automated grading.",
    type: "website",
  },
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <DetailedFeaturesSection />
      <CTASection />
    </main>
  );
}
