import React, { useState, useEffect } from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: string; // Target X translation
  ty: string; // Target Y translation
  rotation: string;
  type: 'DIAMOND' | 'FIRE';
  color: string;
  delay: string;
}

export const PixelButton: React.FC<PixelButtonProps> = ({ onClick, children, className, ...props }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isExploding, setIsExploding] = useState(false);

  // Clear particles after animation
  useEffect(() => {
    if (isExploding) {
      const timer = setTimeout(() => {
        setParticles([]);
        setIsExploding(false);
      }, 1000); // Match longest animation duration
      return () => clearTimeout(timer);
    }
  }, [isExploding]);

  const handleExplosion = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.disabled) return;
    
    // Trigger original click
    if (onClick) onClick(e);

    // Spawn Particles
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newParticles: Particle[] = [];
    const count = 25; // Number of particles

    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.5 ? 'DIAMOND' : 'FIRE';
      // Random angle and distance
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 150; // Random distance
      
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      // Random Colors
      const colors = type === 'DIAMOND' 
        ? ['#00d4ff', '#ffffff', '#5c4fb3'] 
        : ['#ff6b00', '#d32f2f', '#fbc02d'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      newParticles.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        tx: `${tx}px`,
        ty: `${ty}px`,
        rotation: `${Math.random() * 360}deg`,
        type,
        color,
        delay: `${Math.random() * 0.1}s`
      });
    }

    setParticles(newParticles);
    setIsExploding(true);
  };

  return (
    <button
      onClick={handleExplosion}
      className={`relative overflow-visible group ${className}`} // Ensure overflow-visible for particles
      {...props}
    >
      {/* Particle Container */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none z-50 top-0 left-0"
          style={{
            left: p.x,
            top: p.y,
            '--tx': p.tx,
            '--ty': p.ty,
            '--rot': p.rotation,
            '--delay': p.delay,
            '--color': p.color,
            animation: 'pixel-explode 0.8s ease-out forwards',
            animationDelay: p.delay
          } as React.CSSProperties}
        >
          {p.type === 'DIAMOND' ? (
            <div className="pixel-diamond"></div>
          ) : (
            <div className="pixel-fire"></div>
          )}
        </div>
      ))}

      {/* Button Content - Flexible Layout */}
      <span className="relative z-10 w-full h-full block">
        {children}
      </span>

      {/* Inject Styles locally for encapsulation */}
      <style>{`
        @keyframes pixel-explode {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)) scale(0);
            opacity: 0;
          }
        }

        /* 3x3 Pixel Scale (1px = 3px rendered) */
        .pixel-diamond {
          width: 3px; height: 3px;
          background: transparent;
          box-shadow: 
            3px 0 var(--color), 
            -3px 0 var(--color), 
            0 3px var(--color), 
            0 -3px var(--color), 
            0 0 #fff;
        }

        .pixel-fire {
          width: 3px; height: 3px;
          background: transparent;
          box-shadow: 
            0 0 var(--color),
            3px 3px var(--color),
            -3px 3px var(--color),
            0 6px var(--color),
            0 -3px var(--color);
        }
      `}</style>
    </button>
  );
};