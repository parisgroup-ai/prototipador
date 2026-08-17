import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

interface DataMeta {
  models: Record<string, string>
  relationships: string[]
}

interface DataCardProps {
  data: Record<string, unknown> | null
}

function extractMeta(data: Record<string, unknown>): DataMeta | null {
  const meta = data._meta as DataMeta | undefined
  if (meta && typeof meta === 'object' && meta.models && meta.relationships) {
    return meta
  }
  return null
}

function getDataWithoutMeta(data: Record<string, unknown>): Record<string, unknown> {
  const { _meta, ...rest } = data
  return rest
}

function countRecords(data: Record<string, unknown>): number {
  // Count arrays at the top level as record collections (excluding _meta)
  let count = 0
  for (const [key, value] of Object.entries(data)) {
    if (key !== '_meta' && Array.isArray(value)) {
      count += value.length
    }
  }
  return count
}

export function DataCard({ data }: DataCardProps) {
  const [isJsonOpen, setIsJsonOpen] = useState(false)

  // Empty state
  if (!data) {
    return <EmptyState type="data" />
  }

  const meta = extractMeta(data)
  const dataWithoutMeta = getDataWithoutMeta(data)
  const recordCount = countRecords(data)

  return (
    <Card className="border-white/[0.06] shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg font-semibold text-white">
            Dados de exemplo
          </CardTitle>
          {recordCount > 0 && (
            <span className="text-xs font-medium text-white/40 bg-white/[0.04] px-2 py-0.5 rounded">
              {recordCount} {recordCount === 1 ? 'registro' : 'registros'}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Data Shape Descriptions */}
        {meta && (
          <div className="space-y-6">
            {/* Models - Card Grid */}
            <div>
              <h4 className="text-sm font-medium text-white/40 uppercase tracking-wide mb-3">
                Modelos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(meta.models).map(([modelName, description]) => (
                  <div
                    key={modelName}
                    className="bg-white/[0.02] rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-white mb-1">
                      {modelName}
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationships */}
            {meta.relationships.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white/40 uppercase tracking-wide mb-3">
                  Como eles se conectam
                </h4>
                <ul className="space-y-2">
                  {meta.relationships.map((relationship, index) => (
                    <li
                      key={index}
                      className="text-white/65 flex items-start gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                      {relationship}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Collapsible JSON View */}
        <Collapsible open={isJsonOpen} onOpenChange={setIsJsonOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-left group">
            <ChevronDown
              className={`w-4 h-4 text-white/40 transition-transform ${
                isJsonOpen ? 'rotate-180' : ''
              }`}
              strokeWidth={1.5}
            />
            <span className="text-xs text-white/40 group-hover:text-white/80 transition-colors">
              {isJsonOpen ? 'Esconder' : 'Ver'} JSON
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white/[0.02] rounded-md p-4 overflow-x-auto mt-3">
              <pre className="text-xs font-mono text-white/65 whitespace-pre-wrap">
                {JSON.stringify(dataWithoutMeta, null, 2)}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
