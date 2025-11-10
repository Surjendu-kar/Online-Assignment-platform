"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  glareColor = "#ffffff",
  glareOpacity = 0.3,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);
  const [duplicatedItems, setDuplicatedItems] = useState<typeof items>([]);
  const [isCardHovered, setIsCardHovered] = useState(false);

  useEffect(() => {
    // Duplicate items for infinite scroll effect
    setDuplicatedItems([...items, ...items]);
  }, [items]);

  useEffect(() => {
    if (duplicatedItems.length > 0) {
      addAnimation();
    }
  }, [duplicatedItems]);

  // Convert hex to rgba for glare effect
  const getGlareRgba = () => {
    const hex = glareColor.replace("#", "");
    let rgba = glareColor;
    if (/^[\dA-Fa-f]{6}$/.test(hex)) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
    } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
    }
    return rgba;
  };

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  // Card component with glare effect
  const Card = ({ item }: { item: { quote: string; name: string; title: string } }) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const rgba = getGlareRgba();

    const handleMouseEnter = () => {
      if (pauseOnHover) {
        setIsCardHovered(true);
      }

      // Glare animation
      const el = overlayRef.current;
      if (!el) return;

      el.style.transition = "none";
      el.style.backgroundPosition = "-100% -100%, 0 0";
      requestAnimationFrame(() => {
        el.style.transition = `${transitionDuration}ms ease`;
        el.style.backgroundPosition = "100% 100%, 0 0";
      });
    };

    const handleMouseLeave = () => {
      if (pauseOnHover) {
        setIsCardHovered(false);
      }

      // Glare animation
      const el = overlayRef.current;
      if (!el) return;

      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = "-100% -100%, 0 0";
    };

    const overlayStyle: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(${glareAngle}deg,
        hsla(0,0%,0%,0) 60%,
        ${rgba} 70%,
        hsla(0,0%,0%,0) 100%)`,
      backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "-100% -100%, 0 0",
      pointerEvents: "none",
      borderRadius: "inherit",
      zIndex: 30,
    };

    return (
      <li
        className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-border bg-card px-8 py-6 md:w-[450px] transition-colors overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={overlayRef} style={overlayStyle} />
        <blockquote className="relative">
          <div
            aria-hidden="true"
            className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
          ></div>
          <span className="relative z-10 text-sm leading-[1.6] font-normal text-foreground">
            {item.quote}
          </span>
          <div className="relative z-10 mt-6 flex flex-row items-center">
            <span className="flex flex-col gap-1">
              <span className="text-sm leading-[1.6] font-semibold text-foreground">
                {item.name}
              </span>
              <span className="text-sm leading-[1.6] font-normal text-muted-foreground">
                {item.title}
              </span>
            </span>
          </div>
        </blockquote>
      </li>
    );
  };

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && isCardHovered && "[animation-play-state:paused]"
        )}
      >
        {duplicatedItems.map((item, index) => (
          <Card key={`${item.name}-${index}`} item={item} />
        ))}
      </ul>
    </div>
  );
};
