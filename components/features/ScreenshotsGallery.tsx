"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const screenshots = [
  {
    id: 1,
    title: "Admin Dashboard",
    description:
      "Comprehensive institution management with real-time analytics and quick actions",
    category: "Admin",
    image: "/screenshots/admin-dashboard.png",
    placeholder: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Exam Creation Wizard",
    description: "Step-by-step exam builder with multi-question type support",
    category: "Teacher",
    image: "/screenshots/exam-creation.png",
    placeholder: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Student Exam Interface",
    description:
      "Clean, distraction-free interface with real-time timer and progress tracking",
    category: "Student",
    image: "/screenshots/student-exam.png",
    placeholder: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  {
    id: 4,
    title: "Code Editor",
    description:
      "Monaco editor with syntax highlighting and multi-language support",
    category: "Student",
    image: "/screenshots/code-editor.png",
    placeholder: "bg-gradient-to-br from-orange-500 to-red-500",
  },
  {
    id: 5,
    title: "Grading Dashboard",
    description:
      "Streamlined grading interface with auto-graded results and manual review",
    category: "Teacher",
    image: "/screenshots/grading-dashboard.png",
    placeholder: "bg-gradient-to-br from-indigo-500 to-blue-500",
  },
  {
    id: 6,
    title: "Proctoring Monitor",
    description:
      "Real-time violation tracking with webcam preview and activity logs",
    category: "Teacher",
    image: "/screenshots/proctoring.png",
    placeholder: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
];

const categories = ["All", "Admin", "Teacher", "Student"];

export default function ScreenshotsGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  const filteredScreenshots =
    activeCategory === "All"
      ? screenshots
      : screenshots.filter((s) => s.category === activeCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === filteredScreenshots.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredScreenshots.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [lightboxOpen, currentImageIndex]);

  return (
    <section className="w-full py-20 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Platform
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Screenshots
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Explore our intuitive interface designed for admins, teachers, and
            students
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-6 py-2 rounded-full border-2 transition-all duration-300 text-sm font-semibold",
                activeCategory === category
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Screenshots Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredScreenshots.map((screenshot, index) => (
              <motion.div
                key={screenshot.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -8 }}
                onClick={() => openLightbox(index)}
                className="group relative cursor-pointer"
              >
                <div className="relative h-full rounded-2xl overflow-hidden bg-card border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10">
                  {/* Image Placeholder */}
                  <div
                    className={cn(
                      "relative aspect-video flex items-center justify-center text-white",
                      screenshot.placeholder
                    )}
                  >
                    <div className="text-center">
                      <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Screenshot Preview</p>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Maximize2 className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {screenshot.title}
                      </h3>
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {screenshot.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {screenshot.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Device View Toggles */}
              <div className="absolute top-4 left-4 z-[110] flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeviceView("desktop");
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    deviceView === "desktop"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  <Monitor className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeviceView("tablet");
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    deviceView === "tablet"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  <Tablet className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeviceView("mobile");
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    deviceView === "mobile"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>

              {/* Image Container */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "relative bg-card rounded-2xl overflow-hidden shadow-2xl",
                  deviceView === "desktop" && "max-w-6xl w-full",
                  deviceView === "tablet" && "max-w-3xl w-full",
                  deviceView === "mobile" && "max-w-sm w-full"
                )}
              >
                {/* Image */}
                <div
                  className={cn(
                    "relative aspect-video flex items-center justify-center text-white",
                    filteredScreenshots[currentImageIndex].placeholder
                  )}
                >
                  <div className="text-center">
                    <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg opacity-75">
                      {filteredScreenshots[currentImageIndex].title}
                    </p>
                  </div>
                </div>

                {/* Caption */}
                <div className="p-6 bg-card border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      {filteredScreenshots[currentImageIndex].title}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {filteredScreenshots[currentImageIndex].category}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {filteredScreenshots[currentImageIndex].description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentImageIndex + 1} of {filteredScreenshots.length}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
