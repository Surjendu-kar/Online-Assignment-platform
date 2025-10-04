"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import DashboardSkeleton from "./DashboardSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // No user logged in, redirect to login
          router.push("/login");
          return;
        }

        if (requiredRole) {
          // Check if user has required role
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profileError || !profileData) {
            router.push("/login");
            return;
          }

          if (profileData.role.toLowerCase() !== requiredRole.toLowerCase()) {
            // User doesn't have required role, redirect to their dashboard
            const rolePath = `/${profileData.role.toLowerCase()}`;
            router.push(rolePath);
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router, requiredRole]);

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        // Clear localStorage on logout
        localStorage.removeItem('userRole');
        localStorage.removeItem('userFirstName');
        localStorage.removeItem('userLastName');
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}