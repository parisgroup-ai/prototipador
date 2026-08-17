import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import type { ProductRoadmap } from '@/types/product'

interface SectionsCardProps {
  roadmap: ProductRoadmap
  onSectionClick: (sectionId: string) => void
}

export function SectionsCard({ roadmap, onSectionClick }: SectionsCardProps) {
  return (
    <Card className="border-white/[0.06] shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white">
          Seções
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-white/[0.06]">
          {roadmap.sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionClick(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-white/[0.08] text-white/65 text-xs font-medium flex items-center justify-center">
                    {section.order}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {section.title}
                    </h3>
                    <p className="text-sm text-white/40 mt-0.5 line-clamp-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
