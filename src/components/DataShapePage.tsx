import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'

export function DataShapePage() {
  const productData = useMemo(() => loadProductData(), [])
  const dataShape = productData.dataShape

  const hasDataShape = !!dataShape
  const stepStatus: StepStatus = hasDataShape ? 'completed' : 'current'

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <div className="paris-eyebrow mb-1.5">Prototipador · Fase 2 de 5</div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Estrutura de dados
          </h1>
          <p className="text-white/60">
            Esboce o formato geral dos dados do seu produto — as entidades principais e como elas se relacionam.
          </p>
        </div>

        {/* Step 1: Data Shape */}
        <StepIndicator step={1} status={stepStatus} isLast={!hasDataShape}>
          {!dataShape ? (
            <EmptyState type="data-shape" />
          ) : (
            <div className="space-y-6">
              {/* Entities */}
              <Card className="border-white/[0.06] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    Entidades
                    <span className="ml-2 text-sm font-normal text-white/40">
                      ({dataShape.entities.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dataShape.entities.length === 0 ? (
                    <p className="text-white/40">Nenhuma entidade definida.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dataShape.entities.map((entity, index) => (
                        <div
                          key={index}
                          className="bg-white/[0.02] rounded-lg p-4"
                        >
                          <h3 className="font-semibold text-white mb-1">
                            {entity.name}
                          </h3>
                          <p className="text-white/65 text-sm leading-relaxed">
                            {entity.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Relationships */}
              <Card className="border-white/[0.06] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    Relações
                    <span className="ml-2 text-sm font-normal text-white/40">
                      ({dataShape.relationships.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dataShape.relationships.length === 0 ? (
                    <p className="text-white/40">Nenhuma relação definida.</p>
                  ) : (
                    <ul className="space-y-2">
                      {dataShape.relationships.map((relationship, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                          <span className="text-white/65">
                            {relationship}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Edit hint */}
              <div className="bg-white/[0.04] rounded-md px-4 py-3">
                <p className="text-sm text-white/65">
                  Pra atualizar a estrutura de dados, rode{' '}
                  <code className="font-mono text-[#a0b4ff]">/dados</code>{' '}
                  ou edite direto o arquivo{' '}
                  <code className="font-mono text-white/85">
                    product/data-shape/data-shape.md
                  </code>
                </p>
              </div>
            </div>
          )}
        </StepIndicator>

        {/* Next Phase Button - shown when all steps complete */}
        {hasDataShape && (
          <StepIndicator step={2} status="current" isLast>
            <NextPhaseButton nextPhase="design" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}
