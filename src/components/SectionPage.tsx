import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { PhaseWarningBanner } from '@/components/PhaseWarningBanner'
import { SpecCard } from '@/components/SpecCard'
import { DataCard } from '@/components/DataCard'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { loadProductData } from '@/lib/product-loader'
import { loadSectionData } from '@/lib/section-loader'
import { ChevronRight, Layout, Download, ArrowRight, LayoutList } from 'lucide-react'

/**
 * Determine the status of each step based on what data exists
 * Steps: 1. Section Overview (Spec), 2. Sample Data, 3. Screen Designs, 4. Screenshots
 */
function getStepStatuses(sectionData: ReturnType<typeof loadSectionData> | null): StepStatus[] {
  const hasSpec = !!sectionData?.specParsed
  const hasData = !!sectionData?.data
  const hasScreenDesigns = !!(sectionData?.screenDesigns && sectionData.screenDesigns.length > 0)
  const hasScreenshots = !!(sectionData?.screenshots && sectionData.screenshots.length > 0)

  const steps: boolean[] = [hasSpec, hasData, hasScreenDesigns, hasScreenshots]
  const firstIncomplete = steps.findIndex((done) => !done)

  return steps.map((done, index) => {
    if (done) return 'completed'
    if (index === firstIncomplete) return 'current'
    return 'upcoming'
  })
}

/**
 * Check if the required steps for a section are complete (Spec, Data, Screen Designs)
 * Screenshots are optional and don't count toward completion
 */
function areRequiredStepsComplete(sectionData: ReturnType<typeof loadSectionData> | null): boolean {
  const hasSpec = !!sectionData?.specParsed
  const hasData = !!sectionData?.data
  const hasScreenDesigns = !!(sectionData?.screenDesigns && sectionData.screenDesigns.length > 0)
  return hasSpec && hasData && hasScreenDesigns
}

export function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const navigate = useNavigate()

  // Load product data to get section info
  const productData = useMemo(() => loadProductData(), [])
  const sections = productData.roadmap?.sections || []
  const section = sections.find((s) => s.id === sectionId)
  const currentIndex = sections.findIndex((s) => s.id === sectionId)

  // Load section-specific data (spec, data.json, screen designs, screenshots)
  const sectionData = useMemo(
    () => (sectionId ? loadSectionData(sectionId) : null),
    [sectionId]
  )

  // Handle missing section
  if (!section) {
    return (
      <AppLayout backTo="/sections" backLabel="Seções">
        <div className="text-center py-12">
          <p className="text-white/65">
            Seção não encontrada: {sectionId}
          </p>
        </div>
      </AppLayout>
    )
  }

  const stepStatuses = getStepStatuses(sectionData)
  const requiredStepsComplete = areRequiredStepsComplete(sectionData)

  // Next section navigation logic
  const isLastSection = currentIndex === sections.length - 1 || currentIndex === -1
  const nextSection = !isLastSection ? sections[currentIndex + 1] : null

  return (
    <AppLayout backTo="/sections" backLabel="Seções" title={section.title}>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <div className="paris-eyebrow mb-1.5">Prototipador · Seção {section.order}</div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            {section.title}
          </h1>
          <p className="text-white/60">
            {section.description}
          </p>
        </div>

        {/* Warning banner for incomplete prerequisite phases */}
        <PhaseWarningBanner />

        {/* Step 1: Section Overview (Spec) */}
        <StepIndicator step={1} status={stepStatuses[0]}>
          <SpecCard spec={sectionData?.specParsed || null} sectionTitle="Especificação da seção" />
        </StepIndicator>

        {/* Step 2: Sample Data */}
        <StepIndicator step={2} status={stepStatuses[1]}>
          <DataCard data={sectionData?.data || null} />
        </StepIndicator>

        {/* Step 3: Screen Designs */}
        <StepIndicator step={3} status={stepStatuses[2]}>
          {!sectionData?.screenDesigns || sectionData.screenDesigns.length === 0 ? (
            <EmptyState type="screen-designs" />
          ) : (
            <Card className="border-white/[0.06] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white">
                  Telas
                  <span className="ml-2 text-sm font-normal text-white/40">
                    ({sectionData.screenDesigns.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-white/[0.06]">
                  {sectionData.screenDesigns.map((screenDesign) => (
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
          )}
        </StepIndicator>

        {/* Step 4: Screenshots */}
        <StepIndicator step={4} status={stepStatuses[3]} isLast={!requiredStepsComplete}>
          {!sectionData?.screenshots || sectionData.screenshots.length === 0 ? (
            <EmptyState type="screenshots" />
          ) : (
            <Card className="border-white/[0.06] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white">
                  Screenshots
                  <span className="ml-2 text-sm font-normal text-white/40">
                    ({sectionData.screenshots.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {sectionData.screenshots.map((screenshot) => (
                    <div key={screenshot.name} className="group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-white/[0.04] border border-white/[0.06]">
                        <img
                          src={screenshot.url}
                          alt={screenshot.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-sm text-white/65 truncate">
                          {screenshot.name}
                        </p>
                        <a
                          href={screenshot.url}
                          download={`${screenshot.name}.png`}
                          className="shrink-0 p-1.5 rounded-md text-white/35 hover:text-white/80 hover:bg-white/[0.05] transition-colors"
                          title="Baixar screenshot"
                        >
                          <Download className="w-4 h-4" strokeWidth={1.5} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </StepIndicator>

        {/* Next Step - shown when required steps (Spec, Data, Screen Designs) are complete */}
        {requiredStepsComplete && (
          <StepIndicator step={5} status="current" isLast>
            <div className="space-y-3">
              {/* If there's a next section, show two options */}
              {nextSection ? (
                <>
                  <button
                    onClick={() => navigate(`/sections/${nextSection.id}`)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 paris-cta rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                      <span className="relative z-10 font-medium">Avançar pra {nextSection.title}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => navigate('/sections')}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white/[0.04] text-white/65 rounded-lg hover:bg-white/[0.06] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutList className="w-5 h-5" strokeWidth={1.5} />
                      <span className="font-medium">Ver todas as seções</span>
                    </div>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </button>
                </>
              ) : (
                /* If this is the last or only section, show single link back to sections */
                <button
                  onClick={() => navigate('/sections')}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 paris-cta rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <LayoutList className="w-5 h-5" strokeWidth={1.5} />
                    <span className="relative z-10 font-medium">Voltar pra todas as seções</span>
                  </div>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}
