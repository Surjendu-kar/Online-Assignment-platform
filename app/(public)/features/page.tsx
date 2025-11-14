"use client";
import { Metadata } from "next";
import DetailedFeaturesSection from "@/components/features/DetailedFeaturesSection";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";

// export const metadata: Metadata = {
//   title: "Features | Online Exam Assignment Platform",
//   description:
//     "Discover powerful features for modern education: Multi-question types, AI-powered proctoring, institution management, real-time grading, and more.",
//   openGraph: {
//     title: "Features | Online Exam Assignment Platform",
//     description:
//       "Comprehensive exam platform with MCQ, SAQ, and coding questions, proctoring, and automated grading.",
//     type: "website",
//   },
// };

export default function FeaturesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center w-full bg-gray-50 dark:bg-[#020618] px-2 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Powerful Features for
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Modern Education
            </span>
          </h1>
          <p className="text-muted-foreground text-md md:text-lg max-w-3xl mx-auto mb-8">
            Everything you need to create, deliver, and grade comprehensive
            online exams with security, efficiency, and ease.
          </p>
        </motion.div>
      </section>

      <DetailedFeaturesSection />
      <CTASection />
    </>
  );
}
