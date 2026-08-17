import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, PanelTop, Square } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { ParsedSpec } from '@/types/section'

interface SpecCardProps {
  spec: ParsedSpec | null
  sectionTitle?: string
}

export function SpecCard({ spec, sectionTitle }: SpecCardProps) {
  const [userFlowsOpen, setUserFlowsOpen] = useState(false)
  const [uiReqOpen, setUiReqOpen] = useState(false)

  // Empty state
  if (!spec) {
    return <EmptyState type="spec" />
  }

  return (
    <Card className="border-white/[0.06] shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white">
          {sectionTitle || 'Especificação'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overview */}
        {spec.overview && (
          <p className="text-white/65 leading-relaxed">
            {spec.overview}
          </p>
        )}

        {/* User Flows - Expandable */}
        {spec.userFlows.length > 0 && (
          <Collapsible open={userFlowsOpen} onOpenChange={setUserFlowsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
              <span className="text-sm font-medium text-white/40 uppercase tracking-wide">
                Fluxos do usuário
                <span className="ml-2 text-white/40 normal-case tracking-normal">
                  ({spec.userFlows.length})
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/40 transition-transform ${
                  userFlowsOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-2 pt-2">
                {spec.userFlows.map((flow, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#4F6AFF] to-[#8B5CF6] mt-2 shrink-0" />
                    <span className="text-white/65 text-sm">
                      {flow}
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* UI Requirements - Expandable */}
        {spec.uiRequirements.length > 0 && (
          <Collapsible open={uiReqOpen} onOpenChange={setUiReqOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
              <span className="text-sm font-medium text-white/40 uppercase tracking-wide">
                Requisitos de interface
                <span className="ml-2 text-white/40 normal-case tracking-normal">
                  ({spec.uiRequirements.length})
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/40 transition-transform ${
                  uiReqOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-2 pt-2">
                {spec.uiRequirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#4F6AFF] to-[#8B5CF6] mt-2 shrink-0" />
                    <span className="text-white/65 text-sm">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Display Configuration */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
          {spec.useShell ? (
            <>
              <PanelTop className="w-4 h-4 text-white/40" strokeWidth={1.5} />
              <span className="text-sm text-white/40">
                Renderiza dentro da estrutura do app
              </span>
            </>
          ) : (
            <>
              <Square className="w-4 h-4 text-white/40" strokeWidth={1.5} />
              <span className="text-sm text-white/40">
                Página independente (sem a estrutura)
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
