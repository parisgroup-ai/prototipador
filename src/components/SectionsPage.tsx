import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { PhaseWarningBanner } from '@/components/PhaseWarningBanner'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'
import { getSectionScreenDesigns, getSectionScreenshots, hasSectionSpec, hasSectionData } from '@/lib/section-loader'
import { ChevronRight, Check, Circle } from 'lucide-react'

interface SectionProgress {
  hasSpec: boolean
  hasData: boolean
  hasScreenDesigns: boolean
  screenDesignCount: number
  hasScreenshots: boolean
  screenshotCount: number
}

function getSectionProgress(sectionId: string): SectionProgress {
  const screenDesigns = getSectionScreenDesigns(sectionId)
  const screenshots = getSectionScreenshots(sectionId)
  return {
    hasSpec: hasSectionSpec(sectionId),
    hasData: hasSectionData(sectionId),
    hasScreenDesigns: screenDesigns.length > 0,
    screenDesignCount: screenDesigns.length,
    hasScreenshots: screenshots.length > 0,
    screenshotCount: screenshots.length,
  }
}

export function SectionsPage() {
  const navigate = useNavigate()
  const productData = useMemo(() => loadProductData(), [])

  const sections = productData.roadmap?.sections || []

  // Calculate progress for each section
  const sectionProgressMap = useMemo(() => {
    const map: Record<string, SectionProgress> = {}
    for (const section of sections) {
      map[section.id] = getSectionProgress(section.id)
    }
    return map
  }, [sections])

  // Count completed sections (those with spec, data, AND screen designs)
  const completedSections = sections.filter(s => {
    const p = sectionProgressMap[s.id]
    return p?.hasSpec && p?.hasData && p?.hasScreenDesigns
  }).length

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <div className="paris-eyebrow mb-1.5">Prototipador · Fase 4 de 5</div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Seções
          </h1>
          <p className="text-white/60">
            Desenhe cada seção do seu produto: especificação, dados de exemplo e telas.
          </p>
          {sections.length > 0 && (
            <p className="text-sm text-white/40 mt-2">
              {completedSections} de {sections.length} seções concluídas
            </p>
          )}
        </div>

        {/* Warning banner for incomplete prerequisite phases */}
        <PhaseWarningBanner />

        {/* Sections list */}
        {sections.length === 0 ? (
          <EmptyState type="roadmap" />
        ) : (
          <Card className="border-white/[0.06] shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-white">
                Todas as seções
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-white/[0.06]">
                {sections.map((section) => {
                  const progress = sectionProgressMap[section.id]
                  const isComplete = progress?.hasSpec && progress?.hasData && progress?.hasScreenDesigns

                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => navigate(`/sections/${section.id}`)}
                        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          {/* Status indicator */}
                          <div className="shrink-0 mt-0.5">
                            {isComplete ? (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F6AFF] to-[#8B5CF6] flex items-center justify-center shadow-sm shadow-[#8B5CF6]/30">
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center">
                                <span className="text-xs font-medium text-white/65">
                                  {section.order}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-white truncate">
                              {section.title}
                            </h3>
                            <p className="text-sm text-white/40 mt-0.5 line-clamp-1">
                              {section.description}
                            </p>

                            {/* Progress indicators */}
                            <div className="flex items-center gap-3 mt-2">
                              <ProgressDot label="Especificação" done={progress?.hasSpec} />
                              <ProgressDot label="Dados" done={progress?.hasData} />
                              <ProgressDot
                                label={progress?.screenDesignCount ? `${progress.screenDesignCount} tela${progress.screenDesignCount !== 1 ? 's' : ''}` : 'Telas'}
                                done={progress?.hasScreenDesigns}
                              />
                              <ProgressDot
                                label={progress?.screenshotCount ? `${progress.screenshotCount} screenshot${progress.screenshotCount !== 1 ? 's' : ''}` : 'Screenshots'}
                                done={progress?.hasScreenshots}
                                optional
                              />
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" strokeWidth={1.5} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Next Phase Button - shown when all sections are complete */}
        {sections.length > 0 && completedSections === sections.length && (
          <NextPhaseButton nextPhase="export" />
        )}
      </div>
    </AppLayout>
  )
}

interface ProgressDotProps {
  label: string
  done?: boolean
  optional?: boolean
}

function ProgressDot({ label, done, optional }: ProgressDotProps) {
  return (
    <span className={`flex items-center gap-1 text-xs ${
      done
        ? 'text-white/65'
        : optional
          ? 'text-white/25'
          : 'text-white/40'
    }`}>
      {done ? (
        <Check className="w-3 h-3 text-[#8B5CF6]" strokeWidth={2.5} />
      ) : (
        <Circle className={`w-3 h-3 ${optional ? 'opacity-50' : ''}`} strokeWidth={1.5} />
      )}
      {label}
    </span>
  )
}
