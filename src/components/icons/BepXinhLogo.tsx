import React from 'react'

interface LogoProps {
  className?: string
  size?: number
}

export const BepXinhLogo: React.FC<LogoProps> = ({ className = 'w-11 h-11', size }) => {
  return (
    <div
      style={size ? { width: size, height: size } : undefined}
      className={`relative rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-xs border border-orange-100/60 ${className}`}
    >
      <img
        src="/images/bepxinh_logo_perfect.png"
        alt="Bếp Xinh Logo"
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export const PortalHeaderIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => {
  return (
    <div className={`relative rounded-full flex items-center justify-center shrink-0 overflow-hidden ${className}`}>
      <img
        src="/images/bepxinh_logo_perfect.png"
        alt="Bếp Xinh Portal Icon"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
