"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EduExamPortalLogo } from "@/components/EduExamPortalLogo";

const navItems = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Features", link: "/features" },
  { name: "Contact", link: "/contact" },
  { name: "Demo", link: "/demo" },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  const isActive = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname?.startsWith(link);
  };

  return (
    <Navbar className="fixed z-50">
      {/* Desktop Navigation */}
      <NavBody>
        {/* Logo */}
        <Link
          href="/"
          className="relative z-50 mr-4 flex items-center font-normal"
        >
          <motion.div
            initial={{ y: 5 }}
            animate={{
              width: isScrolled ? 200 : 210,
              height: isScrolled ? 45 : 50,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ transformOrigin: "left center", overflow: "hidden" }}
            className="flex items-center"
          >
            <div className="w-full h-full">
              <EduExamPortalLogo
                width={210}
                height={50}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </Link>

        {/* Navigation Items */}
        <motion.div
          onMouseLeave={() => setHovered(null)}
          className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2"
        >
          {navItems.map((item, idx) => {
            const active = isActive(item.link);
            return (
              <Link
                key={`link-${idx}`}
                href={item.link}
                onMouseEnter={() => setHovered(idx)}
                onClick={handleNavClick}
                className={cn(
                  "relative px-4 py-2 transition-colors duration-200",
                  active
                    ? "text-[#2A78F5] dark:text-[#8EC5FF] font-semibold"
                    : "text-neutral-800 dark:text-neutral-300"
                )}
              >
                {hovered === idx && !active && (
                  <motion.div
                    layoutId="hovered"
                    className="absolute inset-0 h-full w-full rounded-full bg-neutral-200/80 dark:bg-white/10 backdrop-blur-md"
                  />
                )}
                <span className="relative z-20 text-[16px]">{item.name}</span>
              </Link>
            );
          })}
        </motion.div>

        <div className="flex items-center gap-4 ">
          {/* Login Button */}
          <Link href="/login">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer "
            >
              <span>Login</span>
            </HoverBorderGradient>
          </Link>

          {/* Theme Toggle */}
          <ThemeTogglerButton
            variant="ghost"
            size="sm"
            modes={["light", "dark"]}
          />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 flex items-center px-0 md:px-2 py-1"
          >
            <motion.div
              initial={{
                y: 5,
              }}
              animate={{
                width: isScrolled ? 180 : 190,
                height: isScrolled ? 42 : 45,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ transformOrigin: "left center", overflow: "hidden" }}
              className="flex items-center"
            >
              <div className="w-full h-full">
                <EduExamPortalLogo
                  width={190}
                  height={45}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </Link>

          {/* Theme Toggle & Hamburger Toggle */}
          <div className="flex items-center gap-3">
            <ThemeTogglerButton
              variant="ghost"
              size="sm"
              modes={["light", "dark"]}
            />
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </MobileNavHeader>

        {/* Mobile Menu */}
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => {
            const active = isActive(item.link);
            return (
              <Link
                key={idx}
                href={item.link}
                onClick={handleNavClick}
                className={cn(
                  "w-full px-4 py-2 transition-colors duration-200",
                  active
                    ? "text-[#FCAA24] dark:text-[#8EC5FF] font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                )}
              >
                {item.name}
              </Link>
            );
          })}
          <Link href="/login" className="w-full">
            <HoverBorderGradient
              containerClassName="rounded-full w-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center justify-center space-x-2 w-full"
            >
              <span>Login</span>
            </HoverBorderGradient>
          </Link>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
