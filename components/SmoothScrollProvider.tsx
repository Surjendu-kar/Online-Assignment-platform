"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type LocomotiveScroll from "locomotive-scroll";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const initLocomotiveScroll = async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;

        if (!scrollRef.current || !isMounted) return;

        locomotiveScrollRef.current = new LocomotiveScroll({
          lenisOptions: {
            wrapper: scrollRef.current,
            content: scrollRef.current.children[0] as HTMLElement,
            lerp: 0.05, // Linear interpolation intensity (0-1, lower = smoother/slower)
            duration: 1.8, // Scroll animation duration (higher = slower)
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.7, // Lower = slower wheel scroll
            touchMultiplier: 1.5, // Lower = slower touch scroll
            infinite: false,
          },
        });

        return () => {
          if (locomotiveScrollRef.current) {
            locomotiveScrollRef.current.destroy();
          }
        };
      } catch (error) {
        console.error("Error initializing Locomotive Scroll:", error);
      }
    };

    initLocomotiveScroll();

    return () => {
      isMounted = false;
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
        locomotiveScrollRef.current = null;
      }
    };
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.scrollTo(0, { immediate: true });
    } else {
      // Fallback to native scroll if Locomotive Scroll is not initialized yet
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div ref={scrollRef} className="overflow-hidden">
      <div>{children}</div>
    </div>
  );
}
