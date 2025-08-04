"use client"
import { useEffect, useState, useMemo } from "react"
import type React from "react"

interface GlowingGridBackgroundProps {
  children: React.ReactNode
  className?: string
  showFloatingElements?: boolean
  showGlowingLines?: boolean
}

export const GradientBackground = ({
  children,
  className = "",
  showFloatingElements = false,
  showGlowingLines = false,
}: GlowingGridBackgroundProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const glowingLines = useMemo(
    () =>
      [...Array(8)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: Math.random() > 0.5 ? "100%" : `${60 + Math.random() * 40}%`,
        height: Math.random() > 0.5 ? "100%" : `${60 + Math.random() * 40}%`,
        delay: `${i * 0.5}s`,
        duration: `${4 + Math.random() * 3}s`,
        isHorizontal: Math.random() > 0.5,
        intensity: 0.3 + Math.random() * 0.4,
      })),
    [],
  )

  const particles = useMemo(
    () =>
      [...Array(15)].map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${i * 0.3}s`,
        size: 1 + Math.random() * 2,
      })),
    [],
  )

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 z-0" />

      {/* Static Grid */}
      <div className="absolute inset-0 z-5 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {showGlowingLines && mounted && (
        <>
          {/* Glowing Grid Lines */}
          {glowingLines.map((line) => (
            <div
              key={line.id}
              className={`absolute z-10 pointer-events-none ${line.isHorizontal ? "h-px" : "w-px"}`}
              style={{
                left: line.isHorizontal ? "0" : line.left,
                top: line.isHorizontal ? line.top : "0",
                width: line.isHorizontal ? line.width : "1px",
                height: line.isHorizontal ? "1px" : line.height,
                background: `linear-gradient(${
                  line.isHorizontal ? "to right" : "to bottom"
                }, transparent, rgba(59, 130, 246, ${line.intensity}), transparent)`,
                boxShadow: `0 0 10px rgba(59, 130, 246, ${line.intensity * 0.8})`,
                animation: `glowPulse ${line.duration} ease-in-out infinite ${line.delay}`,
              }}
            />
          ))}

          {/* Traveling Light Dots */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`dot-${i}`}
              className="absolute w-1 h-1 bg-blue-400 rounded-full z-15 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: "0 0 8px rgba(59, 130, 246, 0.8), 0 0 16px rgba(59, 130, 246, 0.4)",
                animation: `travelDot ${8 + Math.random() * 4}s linear infinite ${i * 1.2}s`,
              }}
            />
          ))}

          {/* Intersection Glows */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`intersection-${i}`}
              className="absolute w-3 h-3 rounded-full z-12 pointer-events-none"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + i * 15}%`,
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                animation: `intersectionGlow ${3 + i * 0.5}s ease-in-out infinite ${i * 0.8}s`,
              }}
            />
          ))}
        </>
      )}

      {showFloatingElements && mounted && (
        <>
          {/* Floating Orbs */}
          {[
            {
              className: "top-20 left-10 w-72 h-72",
              gradient: "from-blue-400/20 to-purple-400/20",
              animation: "float 8s ease-in-out infinite, pulse 5s ease-in-out infinite",
            },
            {
              className: "bottom-20 right-10 w-96 h-96",
              gradient: "from-indigo-400/15 to-cyan-400/15",
              animation: "float 12s ease-in-out infinite 2s, pulse 6s ease-in-out infinite 1s",
            },
          ].map((orb, i) => (
            <div
              key={i}
              className={`absolute ${orb.className} bg-gradient-to-r ${orb.gradient} rounded-full blur-3xl z-8`}
              style={{
                animation: orb.animation,
              }}
            />
          ))}

          {/* Particles */}
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute bg-blue-400/40 rounded-full z-10"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                boxShadow: `0 0 ${p.size * 3}px rgba(59, 130, 246, 0.6)`,
                animation: `particle 12s ease-in-out infinite ${p.delay}`,
              }}
            />
          ))}
        </>
      )}

      {/* Foreground Content */}
      <div className="relative z-20">{children}</div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes glowPulse {
          0%, 100% { 
            opacity: 0.3; 
            filter: blur(0px);
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
          50% { 
            opacity: 1; 
            filter: blur(1px);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4);
          }
        }
        
        @keyframes travelDot {
          0% { 
            transform: translate(0, 0) scale(0.5); 
            opacity: 0;
          }
          10% { 
            opacity: 1; 
            transform: scale(1);
          }
          90% { 
            opacity: 1; 
            transform: scale(1);
          }
          100% { 
            transform: translate(200px, 100px) scale(0.5); 
            opacity: 0;
          }
        }
        
        @keyframes intersectionGlow {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1);
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.5);
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.04); }
        }
        
        @keyframes particle {
          0%, 100% { 
            opacity: 0; 
            transform: translateY(0) translateX(0) scale(0.5); 
          }
          50% { 
            opacity: 0.8; 
            transform: translateY(-100px) translateX(50px) scale(1.2); 
          }
        }
      `}</style>
    </div>
  )
}
