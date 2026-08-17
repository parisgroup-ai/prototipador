import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X } from 'lucide-react'
import { loadProductData } from '@/lib/product-loader'

/**
 * Get a storage key based on the product name to track dismissed warnings per product
 * Converts " & " to "-and-" to maintain semantic meaning
 */
function getStorageKey(productName: string): string {
  const sanitized = productName
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-') // Convert " & " to "-and-" first
    .replace(/[^a-z0-9]+/g, '-')
  return `design-os-phase-warning-dismissed-${sanitized}`
}

export function PhaseWarningBanner() {
  const productData = useMemo(() => loadProductData(), [])
  const [isDismissed, setIsDismissed] = useState(true) // Start dismissed to avoid flash

  const hasDataShape = !!productData.dataShape
  const hasDesignSystem = !!(productData.designSystem?.colors || productData.designSystem?.typography)
  const hasShell = !!productData.shell?.spec
  const hasDesign = hasDesignSystem || hasShell

  const productName = productData.overview?.name || 'default-product'
  const storageKey = getStorageKey(productName)

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey) === 'true'
    setIsDismissed(dismissed)
  }, [storageKey])

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true')
    setIsDismissed(true)
  }

  // Don't show if both phases are complete or if dismissed
  if ((hasDataShape && hasDesign) || isDismissed) {
    return null
  }

  // Build the warning message
  const missingPhases: { name: string; path: string }[] = []
  if (!hasDataShape) {
    missingPhases.push({ name: 'Dados', path: '/data-shape' })
  }
  if (!hasDesign) {
    missingPhases.push({ name: 'Design', path: '/design' })
  }

  return (
    <div className="bg-amber-400/[0.08] border border-amber-400/25 rounded-xl px-4 py-3 mb-6 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-100/90">
            Vale completar{' '}
            {missingPhases.map((phase, index) => (
              <span key={phase.path}>
                {index > 0 && ' e '}
                <Link
                  to={phase.path}
                  className="font-medium underline hover:no-underline"
                >
                  {phase.name}
                </Link>
              </span>
            ))}{' '}
            antes de desenhar as telas das seções.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-300/70 hover:text-amber-100 transition-colors shrink-0"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
