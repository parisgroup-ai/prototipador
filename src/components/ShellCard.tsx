import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, PanelLeft, Layout } from 'lucide-react'
import type { ShellInfo } from '@/types/product'

interface ShellCardProps {
  shell: ShellInfo
}

export function ShellCard({ shell }: ShellCardProps) {
  const [navigationOpen, setNavigationOpen] = useState(false)

  return (
    <Card className="border-white/[0.06] shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <PanelLeft className="w-5 h-5 text-white/40" strokeWidth={1.5} />
          Estrutura do app
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overview */}
        {shell.spec && shell.spec.overview && (
          <p className="text-white/65 leading-relaxed">
            {shell.spec.overview}
          </p>
        )}

        {/* Navigation - Collapsible */}
        {shell.spec && shell.spec.navigationItems.length > 0 && (
          <Collapsible open={navigationOpen} onOpenChange={setNavigationOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
              <span className="text-sm font-medium text-white/40 uppercase tracking-wide">
                Navegação
                <span className="ml-2 text-white/40 normal-case tracking-normal">
                  ({shell.spec.navigationItems.length})
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/40 transition-transform ${
                  navigationOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-2 pt-2 ml-1">
                {shell.spec.navigationItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                    <span className="text-white/65">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* View Shell Design Link */}
        {shell.hasComponents && (
          <div className="pt-2 border-t border-white/[0.04]">
            <Link
              to="/shell/design"
              className="flex items-center justify-between gap-4 py-2 hover:text-white transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-white/[0.08] flex items-center justify-center">
                  <Layout className="w-4 h-4 text-white/65" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-white/65 group-hover:text-white">
                  Ver a estrutura desenhada
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
