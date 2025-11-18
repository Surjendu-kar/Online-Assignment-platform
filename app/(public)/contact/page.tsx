"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";
import { Mail, Phone, Clock, ChevronDown } from "lucide-react";

function ContactPage() {
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !document.getElementById("ubuntu-font-global")
    ) {
      // Preconnect to Google Fonts
      const preconnect1 = document.createElement("link");
      preconnect1.rel = "preconnect";
      preconnect1.href = "https://fonts.googleapis.com";
      if (
        !document.querySelector('link[href="https://fonts.googleapis.com"]')
      ) {
        document.head.appendChild(preconnect1);
      }

      const preconnect2 = document.createElement("link");
      preconnect2.rel = "preconnect";
      preconnect2.href = "https://fonts.gstatic.com";
      preconnect2.setAttribute("crossorigin", "anonymous");
      if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
        document.head.appendChild(preconnect2);
      }

      // Load Ubuntu font
      const link = document.createElement("link");
      link.id = "ubuntu-font-global";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Close the select dropdown arrow after selection
    if (e.target.tagName === "SELECT") {
      setIsSelectOpen(false);
    }
  };

  const handleSelectClick = () => {
    setIsSelectOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-[#020618] pb-20"
      style={{
        fontFamily: '"Ubuntu", sans-serif',
      }}
    >
      <div className="container mx-auto md:px-0 px-2">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col justify-center items-center"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 md:mb-4">
            Get
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              {" "}
              in Touch
            </span>
          </h1>
          <p className="text-sm md:text-lg text-neutral-600 text-center dark:text-neutral-400 max-w-2xl mx-auto">
            Have questions about our platform? We&apos;re here to help. Send us
            a message and we&apos;ll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="shadow-input bg-white p-6 md:p-8 rounded-lg md:rounded-2xl dark:bg-[#0f172b]">
              <h2 className="text-lg md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <LabelInputContainer>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      placeholder="john.doe@university.edu"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </LabelInputContainer>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <LabelInputContainer>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 XXXXX XXXXX"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="subject">Subject *</Label>
                    <div className="relative">
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onClick={handleSelectClick}
                        onBlur={() => setIsSelectOpen(false)}
                        required
                        disabled={loading}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background appearance-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#020618] dark:border-neutral-800"
                      >
                        <option value="">Select a subject</option>
                        <option value="Product Inquiry">Product Inquiry</option>
                        <option value="Technical Support">
                          Technical Support
                        </option>
                        <option value="Account & Billing">
                          Account & Billing
                        </option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Partnership Opportunity">
                          Partnership Opportunity
                        </option>
                        <option value="General Question">
                          General Question
                        </option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown
                        className={cn(
                          "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none transition-transform duration-200",
                          isSelectOpen && "rotate-180"
                        )}
                      />
                    </div>
                  </LabelInputContainer>
                </div>

                <LabelInputContainer>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="resize-none"
                    disabled={loading}
                  />
                </LabelInputContainer>

                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-gradient-to-br dark:from-[#020618] dark:to-[#0f172b] dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message →"}
                  <BottomGradient />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4 md:space-y-6"
          >
            <ContactInfoCard
              icon={<Mail className="w-4 h-4 md:w-6 md:h-6" />}
              title="Email"
              content="support@examplatform.com"
              description="We'll respond within 24 hours"
            />

            <ContactInfoCard
              icon={<Phone className="w-4 h-4 md:w-6 md:h-6" />}
              title="Phone"
              content="+91 XXXXX XXXXX"
              description="Mon-Fri, 10am-8pm IST"
            />

            <ContactInfoCard
              icon={<Clock className="w-4 h-4 md:w-6 md:h-6" />}
              title="Business Hours"
              content="Monday - Friday"
              description="10:00 AM - 8:00 PM IST"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

const ContactInfoCard = ({
  icon,
  title,
  content,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  description: string;
}) => {
  return (
    <div className="shadow-input bg-white p-4 md:p-6 rounded-lg md:rounded-2xl dark:bg-[#0f172b]">
      <div className="flex items-start space-x-4">
        <div className="mt-1 p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-200 md:mb-1">
            {title}
          </h3>
          <p className="text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {content}
          </p>
          <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
