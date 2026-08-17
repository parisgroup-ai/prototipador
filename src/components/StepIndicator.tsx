import { Check, ArrowRight, AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'skipped'

interface StepIndicatorProps {
  step: number
  status: StepStatus
  children: ReactNode
  isLast?: boolean
}

export function StepIndicator({ step, status, children, isLast = false }: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Vertical connecting line - extends from this step to the next */}
      {!isLast && (
        <div
          className="absolute left-[10px] top-[28px] w-[2px] h-[calc(100%+16px)] bg-white/[0.08]"
          aria-hidden="true"
        />
      )}

      {/* Step badge positioned at top-left */}
      <div className="absolute -left-[2px] top-0 z-10">
        <StepBadge step={step} status={status} />
      </div>

      {/* Card content with left padding to accommodate the step indicator */}
      <div className="pl-10">
        {children}
      </div>
    </div>
  )
}

interface StepBadgeProps {
  step: number
  status: StepStatus
}

function StepBadge({ step, status }: StepBadgeProps) {
  const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200"

  if (status === 'completed') {
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-[#4F6AFF] to-[#8B5CF6] text-white shadow-sm shadow-[#8B5CF6]/30`}>
        <Check className="w-3 h-3" strokeWidth={2.5} />
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div className={`${baseClasses} bg-white text-[#05060A] shadow-[0_0_12px_rgba(255,255,255,0.35)]`}>
        <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
      </div>
    )
  }

  if (status === 'skipped') {
    return (
      <div className={`${baseClasses} bg-amber-400/15 text-amber-300 border border-amber-400/30`}>
        <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
      </div>
    )
  }

  // upcoming
  return (
    <div className={`${baseClasses} bg-white/[0.06] text-white/40 border border-white/[0.08]`}>
      {step}
    </div>
  )
}
