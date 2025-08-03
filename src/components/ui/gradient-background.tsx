"use client";
import { useEffect, useState, useMemo } from "react";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showFloatingElements?: boolean;
  showMovingGradient?: boolean;
}

export const GradientBackground = ({
  children,
  className = "",
  showFloatingElements = true,
  showMovingGradient = true
}: GradientBackgroundProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => (
    [...Array(12)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${i * 0.8}s`,
      reverse: i % 2 === 0
    }))
  ), []);

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 z-0" />

      {showMovingGradient && (
        <div
          className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20"
        />
      )}

      {/* Floating Elements */}
      {showFloatingElements && mounted && (
        <>
          {/* Orbs */}
          {[
            {
              className: "top-20 left-10 w-72 h-72",
              gradient: "from-blue-400/20 to-purple-400/20",
              animation: "float 8s ease-in-out infinite, pulse 5s ease-in-out infinite"
            },
            {
              className: "bottom-20 right-10 w-96 h-96",
              gradient: "from-indigo-400/15 to-cyan-400/15",
              animation: "float 12s ease-in-out infinite 2s, pulse 6s ease-in-out infinite 1s"
            },
            {
              className: "top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2",
              gradient: "from-violet-400/10 to-pink-400/10",
              animation: "float 10s ease-in-out infinite 4s, spin 20s linear infinite"
            }
          ].map((orb, i) => (
            <div
              key={i}
              className={`absolute ${orb.className} bg-gradient-to-r ${orb.gradient} rounded-full blur-3xl z-10`}
              style={{
                animation: orb.animation
              }}
            />
          ))}

          {/* Grid and Line Background */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-30">
            {[
              { class: "bg-[linear-gradient(to_right,transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)]", anim: "gridMove 20s linear infinite" },
              { class: "bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(59,130,246,0.05)_2px,rgba(59,130,246,0.05)_4px)]", anim: "slideDown 25s linear infinite" },
              { class: "bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(59,130,246,0.05)_2px,rgba(59,130,246,0.05)_4px)]", anim: "slideRight 30s linear infinite" },
              { class: "bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(59,130,246,0.03)_2px,rgba(59,130,246,0.03)_4px)]", anim: "slideDiagonal 40s linear infinite" }
            ].map((line, i) => (
              <div key={i} className={`absolute inset-0 ${line.class}`} style={{ animation: line.anim }} />
            ))}
          </div>

          {/* Particles */}
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full z-10"
              style={{
                left: p.left,
                top: p.top,
                animation: `particle 10s ease-in-out infinite ${p.delay}`,
                animationDirection: p.reverse ? "reverse" : "normal"
              }}
            />
          ))}
        </>
      )}

      {/* Foreground Content */}
      <div className="relative z-20">{children}</div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.04); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes slideDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        @keyframes slideRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(40px); }
        }
        @keyframes slideDiagonal {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
        @keyframes particle {
          0%, 100% { opacity: 0; transform: translateY(0) translateX(0) scale(1); }
          50% { opacity: 0.8; transform: translateY(-80px) translateX(40px) scale(1.2); }
        }
      `}</style>
    </div>
  );
};
