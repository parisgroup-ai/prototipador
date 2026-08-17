import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useThreeGate } from './useThreeGate'
import { ThreeErrorBoundary } from './ThreeErrorBoundary'

/**
 * Cosmos ambiente — o MESMO efeito three.js do onboarding da Imersão Paris
 * (CountdownCosmos, modo "welcome"): nebulosa azul esparsa + núcleo violeta
 * pulsando de leve + câmera respirando. Fica atrás do conteúdo, apagado o
 * suficiente pra dar vida sem roubar atenção da ferramenta.
 */

interface AmbientCosmosProps {
  /** Opacidade do wrapper (0..1). */
  opacity?: number
}

// ---------------------------------------------------------------------------
// Nebulosa externa: nuvem esparsa de partículas azuis
// ---------------------------------------------------------------------------

function NebulaCloud({ count, speed }: { count: number; speed: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Distribuição esférica com queda suave pro centro — "espaço profundo".
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.pow(Math.random(), 0.4) * 6
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += speed * 0.4
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
  })

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#4F6AFF"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  )
}

// ---------------------------------------------------------------------------
// Núcleo pulsante: esfera densa de partículas violeta no centro
// ---------------------------------------------------------------------------

function PulsingCore({ count, speed }: { count: number; speed: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.6 + Math.random() * 0.9
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y += speed
    ref.current.rotation.x += speed * 0.3
    const s = 1 + Math.sin(t * 1.5) * 0.05
    ref.current.scale.set(s, s, s)
  })

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#8B5CF6"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  )
}

// ---------------------------------------------------------------------------
// Câmera respirando — drift lento em z pra dar vida sem enjoar
// ---------------------------------------------------------------------------

function BreathingCamera() {
  const { camera } = useThree()
  const baseZ = useRef(camera.position.z)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    camera.position.z = baseZ.current + Math.sin(t * 0.3) * 0.2
    camera.position.x = Math.sin(t * 0.15) * 0.1
  })

  return null
}

function Scene() {
  // Velocidade fixa e calma — aqui é ferramenta de trabalho, não contagem
  // regressiva. Os counts baixos (400+200) mantêm 60fps em GPU integrada.
  const baseSpeed = 0.0012
  return (
    <>
      <BreathingCamera />
      <ambientLight intensity={0.4} />
      <NebulaCloud count={400} speed={baseSpeed} />
      <PulsingCore count={200} speed={baseSpeed * 2} />
    </>
  )
}

/**
 * Fallback estático (gradient blobs) — Safari Privado, sem WebGL, ou
 * prefers-reduced-motion. Zero custo runtime após o paint inicial.
 */
function CosmosFallback({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity }}
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '90vmin',
          height: '90vmin',
          background:
            'radial-gradient(circle at 50% 50%, rgba(124,92,240,0.18), rgba(79,106,255,0.10) 35%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute right-1/4 top-1/4"
        style={{
          width: '40vmin',
          height: '40vmin',
          background: 'radial-gradient(circle, rgba(139,92,246,0.16), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}

export function AmbientCosmos({ opacity = 1 }: AmbientCosmosProps) {
  const ok = useThreeGate()
  if (ok === null) return null
  if (!ok) return <CosmosFallback opacity={opacity} />

  return (
    <ThreeErrorBoundary fallback={<CosmosFallback opacity={opacity} />}>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity }}
        aria-hidden
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: false,
            alpha: true,
            failIfMajorPerformanceCaveat: false,
          }}
        >
          <Scene />
        </Canvas>
      </div>
    </ThreeErrorBoundary>
  )
}
