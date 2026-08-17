import { Suspense, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, ArrowLeft } from 'lucide-react'
import { PhaseNav } from './PhaseNav'
import { AmbientCosmos } from './three/AmbientCosmos'
import { Button } from '@/components/ui/button'

interface AppLayoutProps {
  children: ReactNode
  /** Optional title shown in the header (for sub-pages) */
  title?: string
  /** Optional back navigation path */
  backTo?: string
  /** Optional back label */
  backLabel?: string
  /** Whether to show the phase nav (default: true) */
  showPhaseNav?: boolean
}

export function AppLayout({
  children,
  title,
  backTo,
  backLabel = 'Voltar',
  showPhaseNav = true,
}: AppLayoutProps) {
  const navigate = useNavigate()

  // Determine if this is a sub-page (has back navigation)
  const isSubPage = !!backTo

  return (
    <div className="relative min-h-screen bg-background animate-fade-in flex flex-col overflow-x-clip">
      {/* Cosmos three.js ambiente — o mesmo do onboarding da imersão */}
      <Suspense fallback={null}>
        <AmbientCosmos opacity={0.5} />
      </Suspense>

      {/* Vignette — escurece as bordas pra o conteúdo respirar sobre o cosmos */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(5,6,10,0.4) 100%)',
        }}
        aria-hidden
      />

      {/* Header — mesh de gradiente + borda sutil, como o WizardHeader do onboarding */}
      <header className="relative border-b border-white/[0.06] bg-background/80 backdrop-blur-sm sticky top-0 z-20 overflow-hidden">
        <div className="paris-mesh" />
        <div className="relative px-4 sm:px-6 py-3">
          {isSubPage ? (
            /* Sub-page header with back button */
            <div className="max-w-3xl mx-auto flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(backTo)}
                className="text-white/60 hover:text-white -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                {backLabel}
              </Button>
              {title && (
                <>
                  <div className="h-4 w-px bg-white/10" />
                  <h1 className="text-sm font-medium text-white truncate">
                    {title}
                  </h1>
                </>
              )}
            </div>
          ) : (
            /* Main page header with phase nav - centered */
            showPhaseNav && (
              <div className="flex justify-center">
                <PhaseNav />
              </div>
            )
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        {children}
      </main>

      {/* Footer with logo */}
      <footer className="relative z-10 py-8 flex justify-center">
        <a
          href="https://github.com/parisgroup-ai/prototipador"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors group"
        >
          <span className="text-xs">Imersão Paris ·</span>
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#4F6AFF] to-[#8B5CF6] flex items-center justify-center transition-opacity group-hover:opacity-80">
            <Layers className="w-3 h-3 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-medium">Prototipador</span>
        </a>
      </footer>
    </div>
  )
}
