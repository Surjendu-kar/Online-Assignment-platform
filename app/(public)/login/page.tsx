"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PasswordToggle } from "@/components/ui/password-toggle";
import { signIn, getRedirectPath } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        toast.error(error.message || "Failed to sign in");
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Get user role from localStorage (set in signIn function)
        const userRole = localStorage.getItem('userRole') || 'student';

        // Use existing getRedirectPath function with the correct parameter
        const redirectPath = getRedirectPath({ role: userRole });
        console.log("Redirecting to:", redirectPath);

        // Trigger redirect animation
        setIsRedirecting(true);

        // Redirect after animation completes
        setTimeout(() => {
          router.push(redirectPath);
        }, 300);

        toast.success("Signed in successfully");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#020618]"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={isRedirecting ?
          { opacity: 0, scale: 0.95, filter: "blur(10px)" } :
          { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.3 }}
        className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-[#0f172b] shadow-lg border border-gray-100 dark:shadow-sm dark:border-none dark:border-gray-800"
      >
        <h2 className="text-xl text-center font-bold text-neutral-800 dark:text-neutral-200">
          Welcome Back
        </h2>
        <p className="mt-2 max-w-sm text-sm text-center text-neutral-600 dark:text-neutral-300">
          Sign in to continue to your dashboard
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="your.email@university.edu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordToggle
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                hasValue={!!password}
              />
            </div>
          </LabelInputContainer>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-gradient-to-br dark:from-[#020618] dark:to-[#0f172b] dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
            disabled={loading || isRedirecting}
          >
            {loading ? "Signing in..." : "Sign in"} &rarr;
            <BottomGradient />
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
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

export default Login;
