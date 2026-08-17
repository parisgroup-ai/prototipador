import { useNavigate } from 'react-router-dom'
import { FileText, Boxes, Layout, LayoutList, Package, ArrowRight } from 'lucide-react'
import type { Phase } from './PhaseNav'

interface NextPhaseButtonProps {
  nextPhase: Exclude<Phase, 'product'> // Can't navigate "next" to product since it's first
}

const phaseConfig: Record<Exclude<Phase, 'product'>, { label: string; icon: typeof FileText; path: string }> = {
  'data-shape': { label: 'Dados', icon: Boxes, path: '/data-shape' },
  'design': { label: 'Design', icon: Layout, path: '/design' },
  'sections': { label: 'Seções', icon: LayoutList, path: '/sections' },
  'export': { label: 'Exportar', icon: Package, path: '/export' },
}

export function NextPhaseButton({ nextPhase }: NextPhaseButtonProps) {
  const navigate = useNavigate()
  const config = phaseConfig[nextPhase]
  const Icon = config.icon

  return (
    <button
      onClick={() => navigate(config.path)}
      className="paris-cta w-full flex items-center justify-between gap-4 px-6 py-4 rounded-xl transition-all group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" strokeWidth={1.5} />
        <span className="relative z-10 font-medium">Avançar pra fase {config.label}</span>
      </div>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
    </button>
  )
}
