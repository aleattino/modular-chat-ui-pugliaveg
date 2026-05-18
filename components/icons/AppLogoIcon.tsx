import React from 'react';

const AppLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    aria-label="Logo assistente"
  >
    <rect x="10" y="25" width="80" height="55" rx="16" fill="currentColor" opacity="0.12" />
    <rect x="10" y="25" width="80" height="55" rx="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
    <circle cx="35" cy="52" r="4" fill="currentColor" />
    <circle cx="50" cy="52" r="4" fill="currentColor" />
    <circle cx="65" cy="52" r="4" fill="currentColor" />
    <path d="M 42 18 C 32 4, 52 4, 50 18" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 58 18 C 68 4, 48 4, 50 18" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default AppLogoIcon;
