import { Metadata } from "next";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import CoreValuesSection from "@/components/about/CoreValuesSection";
import WhyChooseUsSection from "@/components/about/WhyChooseUsSection";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About Us | Online Exam Assignment Platform",
  description:
    "Learn about our mission to revolutionize online education through secure, efficient, and comprehensive exam management solutions for institutions worldwide.",
  openGraph: {
    title: "About Us | Online Exam Assignment Platform",
    description:
      "Transforming education with innovative exam management technology. Trusted by institutions worldwide.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <MissionVisionSection />
      <CoreValuesSection />
      <WhyChooseUsSection />
      <CTASection />
    </>
  );
}
