import React, { useRef } from 'react'

interface OtpInputProps {
  value: string[]
  onChange: (otp: string[]) => void
  disabled?: boolean
}

export const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, disabled }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const char = val.slice(-1)

    if (/^[0-9]$/.test(char) || char === '') {
      const newOtp = [...value]
      newOtp[index] = char
      onChange(newOtp)

      if (char && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = [...value]
        newOtp[index] = ''
        onChange(newOtp)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '')
    if (!pastedData) return

    const newOtp = [...value]
    for (let i = 0; i < 6; i++) {
      if (i < pastedData.length) {
        newOtp[i] = pastedData[i]
      }
    }
    onChange(newOtp)

    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      {/* First 3 boxes */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={value[idx] || ''}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            placeholder="•"
            className="w-9 h-11 md:w-10 md:h-11 bg-white rounded-lg border-0 shadow-2xs text-center font-bold text-slate-700 placeholder:text-slate-400 text-base focus:ring-2 focus:ring-orange-400 outline-none transition-all"
          />
        ))}
      </div>

      {/* Dash */}
      <span className="text-slate-300 font-bold px-0.5">-</span>

      {/* Second 3 boxes */}
      <div className="flex items-center gap-1.5">
        {[3, 4, 5].map((idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={value[idx] || ''}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            placeholder="•"
            className="w-9 h-11 md:w-10 md:h-11 bg-white rounded-lg border-0 shadow-2xs text-center font-bold text-slate-700 placeholder:text-slate-400 text-base focus:ring-2 focus:ring-orange-400 outline-none transition-all"
          />
        ))}
      </div>
    </div>
  )
}
