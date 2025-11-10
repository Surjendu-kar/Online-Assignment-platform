"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import Link from "next/link";

const navItems = [
  { name: "Home", link: "#hero" },
  { name: "Features", link: "#features" },
  { name: "How It Works", link: "#how-it-works" },
  { name: "Demo", link: "#demo" },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    }
  };

  return (
    <Navbar className="fixed z-50">
      {/* Desktop Navigation */}
      <NavBody>
        {/* Logo */}
        <Link
          href="/"
          className="relative z-20 mr-4 flex items-center font-normal text-black"
        >
          <span className="font-bold text-2xl text-black dark:text-white">
            ExamPlatform
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex-1">
          <NavItems items={navItems} />
        </div>

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
            className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
          >
            <span className="font-bold text-xl text-black dark:text-white">
              ExamPlatform
            </span>
          </Link>

          {/* Hamburger Toggle */}
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>

        {/* Mobile Menu */}
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={handleNavClick}
              className="w-full px-4 py-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
            >
              {item.name}
            </a>
          ))}
          <Link href="/login" className="w-full">
            <HoverBorderGradient
              containerClassName="rounded-full w-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center justify-center space-x-2 w-full"
            >
              <span>Login</span>
            </HoverBorderGradient>
          </Link>
          <div className="flex justify-center mt-2">
            <ThemeTogglerButton
              variant="ghost"
              size="xs"
              modes={["light", "dark"]}
            />
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
