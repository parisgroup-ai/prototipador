import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ArrowRight, ChevronDown } from 'lucide-react'
import type { ProductOverview } from '@/types/product'

interface ProductOverviewCardProps {
  overview: ProductOverview
}

export function ProductOverviewCard({ overview }: ProductOverviewCardProps) {
  const [problemsOpen, setProblemsOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)

  return (
    <Card className="border-white/[0.06] shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white">
          Visão do produto: {overview.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        {overview.description && (
          <p className="text-white/65 leading-relaxed">
            {overview.description}
          </p>
        )}

        {/* Problems & Solutions - Expandable */}
        {overview.problems.length > 0 && (
          <Collapsible open={problemsOpen} onOpenChange={setProblemsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
              <span className="text-sm font-medium text-white/40 uppercase tracking-wide">
                Problemas e soluções
                <span className="ml-2 text-white/40 normal-case tracking-normal">
                  ({overview.problems.length})
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/40 transition-transform ${
                  problemsOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-3 pt-2">
                {overview.problems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-white mt-1 shrink-0" strokeWidth={2} />
                    <div>
                      <span className="font-medium text-white/85">
                        {problem.title}
                      </span>
                      <span className="text-white/40 mx-2">—</span>
                      <span className="text-white/65">
                        {problem.solution}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Key Features - Expandable */}
        {overview.features.length > 0 && (
          <Collapsible open={featuresOpen} onOpenChange={setFeaturesOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
              <span className="text-sm font-medium text-white/40 uppercase tracking-wide">
                Funcionalidades-chave
                <span className="ml-2 text-white/40 normal-case tracking-normal">
                  ({overview.features.length})
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/40 transition-transform ${
                  featuresOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-2 pt-2 ml-1">
                {overview.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#4F6AFF] to-[#8B5CF6] mt-2 shrink-0" />
                    <span className="text-white/65">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}
