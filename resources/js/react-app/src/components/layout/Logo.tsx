
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: 'default' | 'small';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`bg-construction-primary text-white font-bold rounded-md ${variant === 'small' ? 'p-1 text-sm' : 'p-2 text-base'}`}>
        CIT
      </div>
      {variant === 'default' && (
        <span className="text-xl font-bold hidden lg:inline">
          Construction Issue Tracker
        </span>
      )}
    </Link>
  );
};

export default Logo;
