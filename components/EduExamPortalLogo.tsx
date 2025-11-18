import React from "react";

interface EduExamPortalLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: "full" | "icon";
  scale?: number; // Scale factor for responsive sizing
}

export function EduExamPortalLogo({
  className = "",
  width = 180,
  height = 50,
  variant = "full",
  scale = 1,
}: EduExamPortalLogoProps) {
  // Momo Trust Display font is loaded globally in page.tsx

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
    <div
      className={`flex items-center gap-1 md:gap-1.5 ${className}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
        transition: 'transform 0.5s ease-in-out',
      }}
    >
      {/* Icon Part - Pencil & Paper */}
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <g transform="translate(4, 2)">
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
            className="fill-[#569AF9] stroke-black dark:stroke-[#FFFFFF]"
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
      </svg>

      {/* Text Part with CSS Gradients */}
      <div className="flex flex-col justify-center">
        <style jsx>{`
          @keyframes wave-gradient {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animated-gradient {
            background-size: 200% 200%;
            animation: wave-gradient 6s ease-in-out infinite;
          }
        `}</style>
        <div
          className="flex items-baseline font-black whitespace-nowrap text-xl"
          style={{
            fontFamily: '"Ubuntu", sans-serif',
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          <span
            className="animated-gradient bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #172E5A 0%, #276BDB 25%, #a855f7 50%, #276BDB 75%, #172E5A 100%)',
            }}
          >
            <span className="dark:hidden">EduExamPortal</span>
          </span>
          <span
            className="animated-gradient bg-clip-text text-transparent hidden dark:inline"
            style={{
              backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #70A7FF 25%, #a855f7 50%, #70A7FF 75%, #FFFFFF 100%)',
            }}
          >
            EduExamPortal
          </span>
        </div>
        <p
          className="font-bold text-neutral-500 dark:text-neutral-400 tracking-wide whitespace-nowrap"
          style={{
            fontFamily: '"Ubuntu", sans-serif',
            fontWeight: 500,
            fontSize: '9.5px',
            lineHeight: 1.2,
          }}
        >
          Online Assessment Platform
        </p>
      </div>
    </div>
  );
}
