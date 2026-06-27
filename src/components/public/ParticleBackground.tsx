import type { CSSProperties } from 'react';

const particles = Array.from({ length: 72 }, (_, index) => {
  const seed = index + 1;
  const size = 1 + ((seed * 37) % 30) / 10;
  const left = (seed * 47) % 100;
  const duration = 14 + ((seed * 29) % 18);
  const delay = -((seed * 17) % 30);
  const drift = ((seed * 53) % 160) - 80;
  const opacity = 0.28 + ((seed * 19) % 34) / 100;

  return {
    delay,
    drift,
    duration,
    left,
    mobileHidden: index >= 42,
    opacity,
    size,
  };
});

export default function ParticleBackground() {
  return (
    <div className="elevated-particle-background" aria-hidden="true">
      <div className="elevated-particle-vignette" />
      <div className="elevated-particle-layer">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="elevated-particle"
            data-mobile-hidden={particle.mobileHidden ? 'true' : undefined}
            style={
              {
                '--particle-delay': `${particle.delay}s`,
                '--particle-drift': `${particle.drift}px`,
                '--particle-duration': `${particle.duration}s`,
                '--particle-left': `${particle.left}%`,
                '--particle-opacity': particle.opacity,
                '--particle-size': `${particle.size}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
