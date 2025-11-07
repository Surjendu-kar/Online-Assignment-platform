"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ProfileSetupDialog } from "@/components/ProfileSetupDialog";
import { useEffect, useState } from "react";

interface ProfileCheckerProps {
  children: React.ReactNode;
}

export const ProfileChecker = ({ children }: ProfileCheckerProps) => {
  const [showSetup, setShowSetup] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  // Paths where we don't want to show the setup dialog or authentication checks
  const excludedPaths = ["/login", "/signup", "/auth", "/student-invitation", "/teacher-invitation"];

  // Public routes that should be accessible without authentication
  // Note: Route groups like (public) don't appear in URLs, so we check specific public paths
  const publicRoutes = ["/", "/features", "/about", "/contact", "/legal"];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));

  useEffect(() => {
    const checkProfile = async () => {
      // Skip profile check on excluded paths and public routes
      if (excludedPaths.some(path => pathname.startsWith(path)) || isPublicRoute) {
        return;
      }

      // Check if we've already checked in this session
      const sessionCheckDone = sessionStorage.getItem('profileCheckDone');
      if (sessionCheckDone === 'true') {
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserId(session.user.id);
          
          // Check if user profile is completed and if user is admin
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('profile_completed, role, institution_id')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile) {
            // Only show setup for admin users with incomplete profiles
            if (profile.role === 'admin' && (!profile.profile_completed || !profile.institution_id)) {
              setShowSetup(true);
            } else {
              // Mark as checked if profile is complete or user is not admin
              sessionStorage.setItem('profileCheckDone', 'true');
            }
          } else {
            // Mark as checked if there's an error (to prevent infinite loop)
            sessionStorage.setItem('profileCheckDone', 'true');
          }
        } else {
          // Mark as checked if no session (to prevent infinite loop)
          sessionStorage.setItem('profileCheckDone', 'true');
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        // Mark as checked if there's an error (to prevent infinite loop)
        sessionStorage.setItem('profileCheckDone', 'true');
      }
    };

    checkProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isPublicRoute]);

  const handleSetupComplete = () => {
    setShowSetup(false);
    // Mark as checked after setup completion
    sessionStorage.setItem('profileCheckDone', 'true');
    // Refresh the page or redirect to dashboard
    router.push('/dashboard');
  };

  // Always render children immediately without any loading state
  return (
    <>
      {showSetup && userId && (
        <ProfileSetupDialog 
          isOpen={showSetup} 
          onSetupComplete={handleSetupComplete}
          userId={userId}
        />
      )}
      {children}
    </>
  );
};