import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 250 180"
      width="100%"
      height="100%"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Outer house circuit */}
      <path d="M 145 115 L 85 115 L 85 60 L 125 30 L 165 60 L 165 110" />
      <circle cx="165" cy="115" r="4.5" fill="currentColor" stroke="none" />
      
      {/* Inner house circuit */}
      <path d="M 131 95 L 100 95 L 100 65 L 125 45 L 150 65 L 150 110" />
      <circle cx="134" cy="95" r="4.5" fill="currentColor" stroke="none" />
      
      {showText && (
        <text
          x="125"
          y="155"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif"
          fontSize="28"
          fill="currentColor"
          textAnchor="middle"
          stroke="none"
          letterSpacing="0.8"
        >
          <tspan fontWeight="300" className="opacity-90">Lazy</tspan>
          <tspan fontWeight="800">Nest</tspan>
        </text>
      )}
    </svg>
  );
}
