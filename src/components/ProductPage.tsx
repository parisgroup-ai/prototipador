import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadProductData } from '@/lib/product-loader'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { ProductOverviewCard } from '@/components/ProductOverviewCard'
import { SectionsCard } from '@/components/SectionsCard'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'

/**
 * Determine the status of each step on the Product page
 * Steps: 1. Product Vision, 2. Roadmap
 */
function getProductPageStepStatuses(
  hasOverview: boolean,
  hasRoadmap: boolean
): StepStatus[] {
  const statuses: StepStatus[] = []

  // Step 1: Product Vision
  if (hasOverview) {
    statuses.push('completed')
  } else {
    statuses.push('current')
  }

  // Step 2: Roadmap
  if (hasRoadmap) {
    statuses.push('completed')
  } else if (hasOverview) {
    statuses.push('current')
  } else {
    statuses.push('upcoming')
  }

  return statuses
}

export function ProductPage() {
  const navigate = useNavigate()
  const productData = useMemo(() => loadProductData(), [])

  const hasOverview = !!productData.overview
  const hasRoadmap = !!productData.roadmap
  const allStepsComplete = hasOverview && hasRoadmap

  const stepStatuses = getProductPageStepStatuses(hasOverview, hasRoadmap)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <div className="paris-eyebrow mb-1.5">Prototipador · Fase 1 de 5</div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Definição do produto
          </h1>
          <p className="text-white/60">
            Defina a visão do seu produto e quebre em seções de desenvolvimento.
          </p>
        </div>

        {/* Step 1: Product Vision */}
        <div id="step-overview">
          <StepIndicator step={1} status={stepStatuses[0]}>
            {productData.overview ? (
              <ProductOverviewCard overview={productData.overview} />
            ) : (
              <EmptyState type="overview" />
            )}
          </StepIndicator>
        </div>

        {/* Step 2: Roadmap / Sections Definition */}
        <div id="step-roadmap">
          <StepIndicator step={2} status={stepStatuses[1]} isLast={!allStepsComplete}>
            {productData.roadmap ? (
              <SectionsCard
                roadmap={productData.roadmap}
                onSectionClick={(sectionId) => navigate(`/sections/${sectionId}`)}
              />
            ) : (
              <EmptyState type="roadmap" />
            )}
          </StepIndicator>
        </div>

        {/* Next Phase Button - shown when all steps complete */}
        {allStepsComplete && (
          <StepIndicator step={3} status="current" isLast>
            <NextPhaseButton nextPhase="data-shape" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}
