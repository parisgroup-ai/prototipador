import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, Layout } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { ScreenDesignInfo } from '@/types/section'

interface ScreenDesignsCardProps {
  screenDesigns: ScreenDesignInfo[]
  sectionId: string
}

export function ScreenDesignsCard({ screenDesigns, sectionId }: ScreenDesignsCardProps) {
  // Empty state
  if (screenDesigns.length === 0) {
    return <EmptyState type="screen-designs" />
  }

  return (
    <Card className="border-white/[0.06] shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white">
          Telas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-white/[0.06]">
          {screenDesigns.map((screenDesign) => (
            <li key={screenDesign.name}>
              <Link
                to={`/sections/${sectionId}/screen-designs/${screenDesign.name}`}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-white/[0.08] flex items-center justify-center shrink-0">
                    <Layout className="w-4 h-4 text-white/65" strokeWidth={1.5} />
                  </div>
                  <span className="font-medium text-white truncate">
                    {screenDesign.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40 shrink-0" strokeWidth={1.5} />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
