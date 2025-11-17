import React from "react";

interface EduExamPortalLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: "full" | "icon";
}

export function EduExamPortalLogo({
  className = "",
  width = 180,
  height = 50,
  variant = "full",
}: EduExamPortalLogoProps) {
  // Load Inter font for consistent weight across devices
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('inter-font')) {
      const link = document.createElement('link');
      link.id = 'inter-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@800;900&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  if (variant === "icon") {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Pencil & Paper Icon */}
        <g>
          {/* Paper/Document */}
          <rect
            x="8"
            y="10"
            width="28"
            height="35"
            rx="2"
            fill="url(#gradient1)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Paper Lines */}
          <line
            x1="13"
            y1="18"
            x2="28"
            y2="18"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <line
            x1="13"
            y1="23"
            x2="31"
            y2="23"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <line
            x1="13"
            y1="28"
            x2="26"
            y2="28"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <line
            x1="13"
            y1="33"
            x2="29"
            y2="33"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Pencil */}
          <g transform="rotate(-45 35 25)">
            {/* Pencil body */}
            <rect
              x="32"
              y="18"
              width="6"
              height="20"
              rx="1"
              fill="#FCAA24"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            {/* Pencil tip */}
            <path
              d="M32 38 L35 42 L38 38 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            {/* Eraser */}
            <rect x="32" y="15" width="6" height="3" fill="#FF6B6B" />
          </g>
        </g>
        <defs>
          <linearGradient
            id="gradient1"
            x1="8"
            y1="27.5"
            x2="36"
            y2="27.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2A78F5" opacity="0.15" />
            <stop offset="1" stopColor="#8EC5FF" opacity="0.15" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMinYMid meet"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    >
      {/* Icon Part - Pencil & Paper */}
      <g transform="translate(1, 3)">
        {/* Paper/Document */}
        <rect
          x="3"
          y="3"
          width="24"
          height="30"
          rx="2"
          fill="#569AF9"
          stroke="#2369E4"
          strokeWidth="0.8"
          className="fill-[#569AF9]  stroke-black dark:stroke-[#FFFFFF]"
        />
        {/* Paper Lines */}
        <line
          x1="8"
          y1="10"
          x2="22"
          y2="10"
          stroke="#2369E4"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
          className="stroke-[#FFFFFF]"
        />
        <line
          x1="8"
          y1="15"
          x2="26"
          y2="15"
          stroke="#2369E4"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
          className="stroke-[#FFFFFF]"
        />
        <line
          x1="8"
          y1="20"
          x2="20"
          y2="20"
          stroke="#2369E4"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
          className="stroke-[#FFFFFF]"
        />
        <line
          x1="8"
          y1="25"
          x2="24"
          y2="25"
          stroke="#2369E4"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
          className="stroke-[#FFFFFF]"
        />

        {/* Pencil */}
        <g transform="rotate(-40 26 24)">
          {/* Pencil body */}
          <rect
            x="24"
            y="15"
            width="6"
            height="18"
            rx="1"
            fill="#FCAA24"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Pencil tip */}
          <path
            d="M24 33 L27 37 L30 33 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.6"
          />
          {/* Eraser */}
          <rect x="24" y="12" width="6" height="3" fill="#FF6B6B" />
        </g>
      </g>

      {/* Text Part */}
      <g transform="translate(42, 0)">
        {/* "Edu" in primary color */}
        <text
          x="0"
          y="22"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="900"
          fill="url(#textGradient1)"
          className="fill-[#2369E4] dark:fill-[#8EC5FF]"
          style={{ fontWeight: 900 }}
        >
          Edu
        </text>

        {/* "Exam" in accent color */}
        <text
          x="39"
          y="22"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="900"
          fill="url(#textGradient2)"
          className="fill-[#ff9d00] dark:fill-[#FCAA24]"
          style={{ fontWeight: 900 }}
        >
          Exam
        </text>

        {/* "Portal" */}
        <text
          x="95 "
          y="22"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="900"
          className="fill-neutral-700 dark:fill-neutral-300"
          style={{ fontWeight: 900 }}
        >
          Portal
        </text>

        {/* Tagline */}
        <text
          x="1"
          y="36"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontSize="9.5"
          fontWeight="700"
          className="fill-neutral-500 dark:fill-neutral-400"
          letterSpacing="0.5"
          style={{ fontWeight: 700 }}
        >
          Online Assessment Platform
        </text>
      </g>

      <defs>
        <linearGradient
          id="logoGradient"
          x1="3"
          y1="19"
          x2="31"
          y2="19"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2A78F5" opacity="0.15" />
          <stop offset="1" stopColor="#8EC5FF" opacity="0.15" />
        </linearGradient>
        <linearGradient
          id="textGradient1"
          x1="0"
          y1="22"
          x2="35"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2A78F5" />
          <stop offset="1" stopColor="#1E5FD9" />
        </linearGradient>
        <linearGradient
          id="textGradient2"
          x1="38"
          y1="22"
          x2="83"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCAA24" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
