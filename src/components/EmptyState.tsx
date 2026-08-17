import { useState } from 'react'
import { FileText, Map, ClipboardList, Database, Layout, Package, Boxes, Palette, PanelLeft, Image, Copy, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type EmptyStateType = 'overview' | 'roadmap' | 'spec' | 'data' | 'screen-designs' | 'screenshots' | 'data-shape' | 'design-system' | 'shell' | 'export'

interface EmptyStateProps {
  type: EmptyStateType
}

const config: Record<EmptyStateType, {
  icon: typeof FileText
  title: string
  command: string
  description: string
}> = {
  overview: {
    icon: FileText,
    title: 'Seu produto ainda não foi definido',
    command: '/visao',
    description: 'Conte pro Claude o que é o seu produto: a dor, a ideia e pra quem ele resolve',
  },
  roadmap: {
    icon: Map,
    title: 'Seu roadmap ainda não existe',
    command: '/roadmap',
    description: 'Quebre o produto em seções de desenvolvimento — uma por vez',
  },
  spec: {
    icon: ClipboardList,
    title: 'Esta seção ainda não tem especificação',
    command: '/secao',
    description: 'Defina os fluxos do usuário e o que a interface precisa mostrar',
  },
  data: {
    icon: Database,
    title: 'Ainda não há dados de exemplo',
    command: '/dados-exemplo',
    description: 'Gere dados realistas do SEU negócio pra dar vida às telas',
  },
  'screen-designs': {
    icon: Layout,
    title: 'Nenhuma tela desenhada ainda',
    command: '/tela',
    description: 'Crie as telas desta seção — é aqui que o produto aparece',
  },
  screenshots: {
    icon: Image,
    title: 'Nenhum screenshot capturado ainda',
    command: '/foto',
    description: 'Capture screenshots das suas telas pra documentação e pra apresentação',
  },
  'data-shape': {
    icon: Boxes,
    title: 'A estrutura de dados ainda não foi esboçada',
    command: '/dados',
    description: 'Esboce o formato geral dos dados do seu produto',
  },
  'design-system': {
    icon: Palette,
    title: 'O estilo ainda não foi escolhido',
    command: '/estilo',
    description: 'Escolha as cores e a tipografia do seu produto',
  },
  shell: {
    icon: PanelLeft,
    title: 'A estrutura do app ainda não foi desenhada',
    command: '/estrutura',
    description: 'Desenhe a navegação e o layout que envolvem as telas',
  },
  export: {
    icon: Package,
    title: 'Pronto pra exportar',
    command: '/exportar',
    description: 'Gere o pacote completo pra virar implementação de verdade',
  },
}

export function EmptyState({ type }: EmptyStateProps) {
  const { icon: Icon, title, command, description } = config[type]
  const [copied, setCopied] = useState(false)

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard indisponível — sem drama */ }
  }

  return (
    <Card className="border-white/[0.08] border-dashed bg-white/[0.02] backdrop-blur-sm shadow-none">
      <CardContent className="py-8">
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F6AFF]/15 to-[#8B5CF6]/15 border border-white/[0.06] flex items-center justify-center mb-3">
            <Icon className="w-5 h-5 text-[#a0b4ff]" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-medium text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-white/50 mb-4">
            {description}
          </p>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 w-full">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-1">
              Abra o Claude Code nesta pasta e rode
            </p>
            <button
              type="button"
              onClick={copyCommand}
              title="Copiar comando"
              className="group inline-flex items-center gap-2 rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-white/[0.05] cursor-pointer"
            >
              <code className="text-sm font-mono text-[#a0b4ff]">
                {command}
              </code>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/30 transition-colors group-hover:text-white/70" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
