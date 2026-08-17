import { Component, type ReactNode } from 'react'

/**
 * Error boundary pra árvore three.js (portado do onboarding da Imersão Paris).
 * three.js pode lançar de dentro de useFrame/geometrias; sem boundary a
 * exceção derruba a página inteira. Aqui: loga uma vez e troca pelo fallback.
 */
interface Props {
  fallback: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ThreeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== 'undefined') {
      console.warn('[three] runtime error swallowed:', error)
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
