"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type ParticleProps = {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  className?: string;
};

function Particle({
  id,
  x,
  y,
  size,
  duration,
  delay,
  className,
}: ParticleProps) {
  return (
    <motion.div
      key={id}
      className={cn("absolute rounded-full pointer-events-none", className)}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: [0, Math.random() * 60 - 30],
        y: [0, Math.random() * 60 - 30],
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

type ParticlesContextType = {
  triggerParticles: (event: React.MouseEvent) => void;
  animate: boolean;
};

const ParticlesContext = React.createContext<ParticlesContextType | null>(null);

type ParticlesProps = {
  children: React.ReactNode;
  animate?: boolean;
  asChild?: boolean;
  particleCount?: number;
  className?: string;
};

function Particles({
  children,
  animate = false,
  asChild = false,
  particleCount = 8,
  className,
}: ParticlesProps) {
  const [particles, setParticles] = React.useState<ParticleProps[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const triggerParticles = React.useCallback(
    (event: React.MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const newParticles: ParticleProps[] = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: `${Date.now()}-${i}`,
          x: centerX + (Math.random() - 0.5) * 20,
          y: centerY + (Math.random() - 0.5) * 20,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 0.5 + 0.5,
          delay: Math.random() * 0.1,
          className: "bg-current opacity-70",
        });
      }

      setParticles(newParticles);

      // Clear particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 1000);
    },
    [particleCount]
  );

  React.useEffect(() => {
    if (animate) {
      // Trigger particles automatically when animate prop changes
      const mockEvent = {
        currentTarget: containerRef.current,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.MouseEvent;
      triggerParticles(mockEvent);
    }
  }, [animate, triggerParticles]);

  const contextValue = React.useMemo(
    () => ({
      triggerParticles,
      animate,
    }),
    [triggerParticles, animate]
  );

  const content = (
    <ParticlesContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
      >
        {children}
        <AnimatePresence>
          {particles.map((particle) => (
            <Particle key={particle.id} {...particle} />
          ))}
        </AnimatePresence>
      </div>
    </ParticlesContext.Provider>
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ...child.props,
      className: cn(
        child.props?.className,
        "relative overflow-hidden",
        className
      ),
      children: (
        <ParticlesContext.Provider value={contextValue}>
          {child.props?.children}
          <AnimatePresence>
            {particles.map((particle) => (
              <Particle key={particle.id} {...particle} />
            ))}
          </AnimatePresence>
        </ParticlesContext.Provider>
      ),
    });
  }

  return content;
}

type ParticlesEffectProps = {
  className?: string;
  [key: string]: any;
};

function ParticlesEffect({ className, ...props }: ParticlesEffectProps) {
  // This is a placeholder component that doesn't render anything visible
  // but provides the styling for particles
  return null;
}

function useParticles() {
  const context = React.useContext(ParticlesContext);
  if (!context) {
    throw new Error("useParticles must be used within a Particles component");
  }
  return context;
}

export { Particles, ParticlesEffect, useParticles, type ParticlesProps };
