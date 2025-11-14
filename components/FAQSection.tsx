"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI-powered proctoring work?",
    answer:
      "Our proctoring system uses webcam monitoring to detect violations during exams. It tracks behaviors like looking away from the screen, multiple faces detected, or tab switching. Teachers receive comprehensive proctoring logs and can review flagged incidents. The system is configurable with customizable violation thresholds.",
  },
  {
    question: "What programming languages are supported for coding questions?",
    answer:
      "We support 8+ programming languages including Python, Java, C++, JavaScript, C, Ruby, Go, and Rust through our Judge0 integration. Each language includes syntax highlighting, starter code templates, and custom test case validation. Code execution happens securely on our servers with proper sandboxing.",
  },
  {
    question: "Can I create question banks and reuse questions?",
    answer:
      "Yes! You can create template questions that can be reused across multiple exams. When students start an exam, questions are cloned to their individual accounts, allowing for independent answer submission and grading. This makes it easy to build comprehensive question libraries over time.",
  },
  {
    question: "How is student data and exam content secured?",
    answer:
      "We use industry-standard encryption for data at rest and in transit. All user data is stored with Row-Level Security (RLS) policies ensuring students can only access their own submissions. Exam content is protected with role-based access control, and we comply with GDPR and educational data privacy regulations.",
  },
  {
    question: "Can multiple institutions use the same platform?",
    answer:
      "Absolutely! Our platform is built for multi-tenancy. Admins can create and manage multiple institutions, each with their own departments, teachers, and students. Data is completely isolated between institutions, and each can have their own branding and configuration settings.",
  },
  {
    question:
      "What happens if a student loses internet connection during an exam?",
    answer:
      "We auto-save student responses periodically to prevent data loss. If a connection is lost, students can rejoin the exam and continue from where they left off (if within the time limit). All activity is logged, and teachers can review the session timeline to verify any disruptions.",
  },
  {
    question: "How are coding questions graded?",
    answer:
      "Coding questions support semi-automated grading. Teachers create test cases that automatically run against student submissions. The system shows pass/fail results for each test case. Teachers can then manually review the code, add feedback, and assign final scores based on code quality, efficiency, and correctness.",
  },
  {
    question: "Is there a limit to the number of students or exams?",
    answer:
      "Our platform scales with your needs. There are no hard limits on students, exams, or questions. Performance is optimized for large-scale deployments. Contact our sales team to discuss your specific requirements and we'll create a plan that fits your institution's size and usage patterns.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="w-full py-20 md:py-32 bg-gray-50 dark:bg-[#020618]"
      data-scroll-section
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
          data-scroll
          data-scroll-speed="0.1"
        >
          <h2 className="text-3xl md:text-5xl  font-bold mb-4 leading-tight pb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Frequently Asked
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Questions
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            Everything you need to know about our exam platform
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative"
            >
              {/* Animated gradient background on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 blur-xl"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <motion.button
                onClick={() => toggleFAQ(index)}
                className="relative w-full cursor-pointer text-left p-4 md:p-6 rounded-lg md:rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <motion.h3 className="text-sm md:text-lg font-semibold pr-4 group-hover:text-primary transition-colors">
                    {faq.question}
                  </motion.h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="text-xs md:text-base text-muted-foreground leading-relaxed pt-4 pr-8"
                      >
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="relative mt-12 text-center p-6 md:p-8 rounded-lg md:rounded-2xl bg-card border border-border overflow-hidden group"
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative z-10">
            <motion.h3
              className="text-md md:text-xl font-semibold mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Still have questions?
            </motion.h3>
            <motion.p
              className="text-sm md:text-base text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Can&apos;t find the answer you&apos;re looking for? Our support
              team is here to help.
            </motion.p>
            <motion.a
              href="mailto:support@example.com"
              className="text-sm md:text-base  inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              Contact Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
