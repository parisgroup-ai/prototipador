import { useEffect, useState } from 'react'

/**
 * Gate central de renderização three.js (portado do onboarding da Imersão
 * Paris). Decide UMA VEZ por sessão se o Canvas deve ser montado:
 *
 *  1. Evita o loop de retry do @react-three/fiber quando o browser bloqueia
 *     WebGL (Safari Privado, sandbox, headless).
 *  2. Respeita `prefers-reduced-motion`.
 *  3. Não re-detecta a cada montagem.
 *
 * Retorna `null` antes do primeiro effect, `true` se WebGL OK, `false` caso
 * contrário (o caller mostra um fallback CSS).
 */

let cachedDecision: boolean | null = null

function detect(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return false
    }
  } catch {
    /* matchMedia ausente — segue pro WebGL check */
  }
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    if (!gl) return false
    try {
      ;(gl as WebGLRenderingContext).clear?.((gl as WebGLRenderingContext).COLOR_BUFFER_BIT ?? 0)
    } catch {
      return false
    }
    return true
  } catch {
    return false
  }
}

export function useThreeGate(): boolean | null {
  const [decision, setDecision] = useState<boolean | null>(cachedDecision)
  useEffect(() => {
    if (cachedDecision !== null) {
      setDecision(cachedDecision)
      return
    }
    const result = detect()
    cachedDecision = result
    setDecision(result)
  }, [])
  return decision
}
