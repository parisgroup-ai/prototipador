import { useMemo } from 'react'
import { Check, AlertTriangle, FileText, FolderTree, ChevronDown, Download, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { AppLayout } from '@/components/AppLayout'
import { loadProductData, hasExportZip, getExportZipUrl } from '@/lib/product-loader'
import { getAllSectionIds, getSectionScreenDesigns } from '@/lib/section-loader'

export function ExportPage() {
  const productData = useMemo(() => loadProductData(), [])

  // Get section stats
  const sectionStats = useMemo(() => {
    const allSectionIds = getAllSectionIds()
    const sectionCount = productData.roadmap?.sections.length || 0
    const sectionsWithScreenDesigns = allSectionIds.filter(id => {
      const screenDesigns = getSectionScreenDesigns(id)
      return screenDesigns.length > 0
    }).length
    return { sectionCount, sectionsWithScreenDesigns, allSectionIds }
  }, [productData.roadmap])

  const hasOverview = !!productData.overview
  const hasRoadmap = !!productData.roadmap
  const hasDataShape = !!productData.dataShape
  const hasDesignSystem = !!productData.designSystem
  const hasShell = !!productData.shell
  const hasSections = sectionStats.sectionsWithScreenDesigns > 0

  const requiredComplete = hasOverview && hasRoadmap && hasSections

  // Check for export zip
  const exportZipAvailable = hasExportZip()
  const exportZipUrl = getExportZipUrl()

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <div className="paris-eyebrow mb-1.5">Prototipador · Fase 5 de 5</div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            {exportZipAvailable ? 'Pronto pra virar produto!' : 'Exportar'}
          </h1>
          <p className="text-white/60">
            {exportZipAvailable
              ? 'Baixe o pacote do seu produto e implemente no seu repositório com os prompts e assets que ele traz.'
              : 'Gere o pacote completo pra virar implementação de verdade.'}
          </p>
        </div>

        {/* Status - only show if zip not available */}
        {!exportZipAvailable && (
          <Card className="border-white/[0.06] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                {requiredComplete ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F6AFF] to-[#8B5CF6] flex items-center justify-center shadow-sm shadow-[#8B5CF6]/30">
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    Pronto pra exportar
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-300" strokeWidth={2.5} />
                    </div>
                    Ainda falta coisa
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <ChecklistItem label="Visão do produto" isComplete={hasOverview} />
                <ChecklistItem label="Roadmap" isComplete={hasRoadmap} />
                <ChecklistItem label="Estrutura de dados" isComplete={hasDataShape} />
                <ChecklistItem label="Estilo" isComplete={hasDesignSystem} />
                <ChecklistItem label="Estrutura do app" isComplete={hasShell} />
                <ChecklistItem
                  label={`Seções com telas desenhadas (${sectionStats.sectionsWithScreenDesigns}/${sectionStats.sectionCount})`}
                  isComplete={hasSections}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export command */}
        {requiredComplete && (
          <Card className="border-white/[0.06] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                {exportZipAvailable ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F6AFF] to-[#8B5CF6] flex items-center justify-center shadow-sm shadow-[#8B5CF6]/30">
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    Pacote de exportação pronto
                  </>
                ) : (
                  'Gerar o pacote de exportação'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {exportZipAvailable && exportZipUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#4F6AFF]/[0.08] to-[#8B5CF6]/[0.08] rounded-xl border border-[#8B5CF6]/25">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F6AFF]/20 to-[#8B5CF6]/20 border border-white/[0.06] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#a0b4ff]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">
                        Baixe e use no seu repositório
                      </p>
                      <p className="text-sm text-white/40">
                        product-plan.zip
                      </p>
                    </div>
                    <a
                      href={exportZipUrl}
                      download="product-plan.zip"
                      className="paris-cta inline-flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-lg shrink-0"
                    >
                      <Download className="relative z-10 w-4 h-4" strokeWidth={2} />
                      <span className="relative z-10">Baixar</span>
                    </a>
                  </div>
                  <p className="text-sm text-white/40">
                    Pra gerar de novo, rode <code className="font-mono text-[#a0b4ff]">/exportar</code> outra vez.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white/65">
                    Rode o comando abaixo no Claude Code pra gerar o pacote completo, com componentes, tipos e a documentação de implementação:
                  </p>
                  <div className="bg-white/[0.04] rounded-md px-4 py-3">
                    <code className="text-sm font-mono text-[#a0b4ff]">
                      /exportar
                    </code>
                  </div>
                </div>
              )}

              {/* What's included */}
              <div className="pt-4 border-t border-white/[0.06]">
                <h4 className="text-sm font-medium text-white/40 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <FolderTree className="w-4 h-4" strokeWidth={1.5} />
                  O que vem no pacote
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ExportItem
                    title="Prompts prontos"
                    description="Prompts prontos pra copiar e colar no seu agente de código."
                    items={['one-shot-prompt.md', 'section-prompt.md']}
                  />
                  <ExportItem
                    title="Instruções"
                    description="Guias detalhados de implementação pro seu agente de código."
                    items={['product-overview.md', 'one-shot-instructions.md', 'incremental/ (milestones)']}
                  />
                  <ExportItem
                    title="Estilo"
                    description="Cores, tipografia e configuração de estilo pra manter a marca consistente."
                    items={['CSS tokens', 'Tailwind config', 'Font setup']}
                  />
                  <ExportItem
                    title="Estrutura de dados"
                    description="Definição das entidades e dados de exemplo do seu app."
                    items={['TypeScript types', 'Sample data', 'Entity docs']}
                  />
                  <ExportItem
                    title="Componentes"
                    description="Componentes React e referências visuais de cada seção."
                    items={['Shell components', 'Section components', 'Screenshots']}
                  />
                  <ExportItem
                    title="Instruções de teste"
                    description="Especificações de teste (independentes de framework) pra implementar com TDD."
                    items={['tests.md per section', 'User flow tests', 'Empty state tests']}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* How to use */}
        <Card className="border-white/[0.06] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              Como usar o pacote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Option A - Incremental (Recommended) */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-start justify-between w-full text-left group">
                <div className="flex-1">
                  <h4 className="font-medium text-white">
                    Opção A: incremental (recomendada)
                  </h4>
                  <p className="text-sm text-white/40 mt-1">
                    Construa marco a marco — mais controle e muito mais fácil de depurar.
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/40 mt-1 shrink-0 transition-transform group-data-[state=open]:rotate-180" strokeWidth={1.5} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ol className="text-sm text-white/65 space-y-2 list-decimal list-inside mt-4 pl-1">
                  <li>Copie a pasta <code className="font-mono text-white/85">product-plan/</code> pro seu repositório</li>
                  <li>Comece pela estrutura (<code className="font-mono text-white/85">instructions/incremental/01-shell.md</code>) — estilo + casca do app</li>
                  <li>
                    Pra cada seção:
                    <ul className="mt-1.5 ml-5 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        Abra <code className="font-mono text-white/85">prompts/section-prompt.md</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        Preencha as variáveis do topo (SECTION_NAME, SECTION_ID, NN)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        Copie e cole o prompt no seu agente de código
                      </li>
                    </ul>
                  </li>
                  <li>Revise e teste cada marco antes de avançar pro próximo</li>
                </ol>
              </CollapsibleContent>
            </Collapsible>

            <div className="border-t border-white/[0.06]" />

            {/* Option B - One-Shot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-start justify-between w-full text-left group">
                <div className="flex-1">
                  <h4 className="font-medium text-white">
                    Opção B: de uma vez só
                  </h4>
                  <p className="text-sm text-white/40 mt-1">
                    Construa o app inteiro numa sessão só, com um prompt pronto.
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/40 mt-1 shrink-0 transition-transform group-data-[state=open]:rotate-180" strokeWidth={1.5} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ol className="text-sm text-white/65 space-y-2 list-decimal list-inside mt-4 pl-1">
                  <li>Copie a pasta <code className="font-mono text-white/85">product-plan/</code> pro seu repositório</li>
                  <li>Abra <code className="font-mono text-white/85">prompts/one-shot-prompt.md</code></li>
                  <li>Acrescente o que quiser ao prompt (stack preferida etc.)</li>
                  <li>Copie e cole o prompt no seu agente de código</li>
                  <li>Responda as perguntas do agente (auth, modelagem de usuário etc.)</li>
                  <li>Deixe o agente planejar e implementar tudo</li>
                </ol>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

interface ChecklistItemProps {
  label: string
  isComplete: boolean
}

function ChecklistItem({ label, isComplete }: ChecklistItemProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      {isComplete ? (
        <div className="w-4 h-4 rounded bg-white/[0.08] flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white/65" strokeWidth={3} />
        </div>
      ) : (
        <div className="w-4 h-4 rounded border-2 border-amber-400/60" />
      )}
      <span className="text-sm text-white/65">
        {label}
      </span>
    </div>
  )
}

interface ExportItemProps {
  title: string
  description: string
  items: string[]
}

function ExportItem({ title, description, items }: ExportItemProps) {
  return (
    <div className="bg-white/[0.02] rounded-lg p-4">
      <h4 className="font-medium text-white mb-1">{title}</h4>
      <p className="text-xs text-white/40 mb-3">{description}</p>
      <ul className="text-sm text-white/65 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-white/30" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
