
import React from "react";

interface IconProps {
  className?: string;
}

export const HardHat: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1z" />
      <path d="M4 14v3" />
      <path d="M20 14v3" />
      <path d="M12 2c-2.4 0-4.5 1-5.8 2.5S3.7 8.1 4 10.5c.1.6.3 1.2.6 1.8.3.5.7 1 1.2 1.5.7.6 1.5 1.1 2.4 1.3.7.2 1.4.2 2.1.2h3.4c.7 0 1.4 0 2.1-.2.9-.2 1.7-.7 2.4-1.3.5-.4.9-.9 1.2-1.5.3-.6.5-1.2.6-1.8.3-2.4-.8-4.5-2.2-6C16.5 3 14.4 2 12 2z" />
    </svg>
  );
};
