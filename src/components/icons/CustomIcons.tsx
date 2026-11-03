import React from 'react'

export const GaugeIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-[#059669] ${className}`}
  >
    {/* Curved arc */}
    <path d="M4.5 16.5A9 9 0 0 1 19.5 16.5" />
    {/* Needle */}
    <path d="M12 12l4-4" strokeWidth="2.8" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

export const OpenBookIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-[#9a3412] ${className}`}
  >
    <path d="M2 5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3Z" />
    <path d="M22 5a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3Z" />
  </svg>
)

export const AiBrainGearIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-[#9a3412] ${className}`}
  >
    {/* Head profile */}
    <path d="M16 16v1a2 2 0 0 1-2 2h-1a2 2 0 0 0-2 2v0" />
    <path d="M8 21a2 2 0 0 1-2-2v-3a4 4 0 0 1-2-3.46V10a8 8 0 0 1 16 0v2.5" />
    {/* Cog/gear inside head */}
    <circle cx="12" cy="10" r="2.2" strokeWidth="2" />
    <path d="M12 6.5v1M12 12.5v1M8.5 10h1M14.5 10h1" strokeWidth="2" />
  </svg>
)

export const IdCardIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-[#64748b] ${className}`}
  >
    {/* Badge clip hole */}
    <rect x="3" y="6" width="18" height="15" rx="3" />
    <path d="M10 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
    {/* Photo square */}
    <rect x="6" y="10" width="4" height="4" rx="0.5" />
    {/* Text lines */}
    <path d="M13 11h5M13 14h3" />
  </svg>
)

export const YubiKeyIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-[#0f172a] ${className}`}
  >
    {/* USB / Key connector shape */}
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8M8 12h8" />
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
  </svg>
)
