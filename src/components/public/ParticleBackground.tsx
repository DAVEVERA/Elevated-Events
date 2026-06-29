import type { CSSProperties } from 'react';

type BubbleTier = 'micro' | 'medium' | 'large';

interface BubbleData {
  delay: number;
  drift: number;
  duration: number;
  left: number;
  mobileHidden: boolean;
  opacity: number;
  size: number;
  tier: BubbleTier;
  highlightAngle: number;
}

const TOTAL = 700;

const bubbles: BubbleData[] = Array.from({ length: TOTAL }, (_, index) => {
  const seed = index + 1;
  const pct = index / TOTAL;

  let tier: BubbleTier;
  let size: number;
  let duration: number;
  let opacity: number;

  if (pct < 0.72) {
    tier = 'micro';
    size = 2 + ((seed * 37) % 30) / 10;
    duration = 3 + ((seed * 29) % 4);
    opacity = 0.25 + ((seed * 19) % 35) / 100;
  } else if (pct < 0.92) {
    tier = 'medium';
    size = 5 + ((seed * 41) % 40) / 10;
    duration = 4 + ((seed * 31) % 5);
    opacity = 0.3 + ((seed * 23) % 40) / 100;
  } else {
    tier = 'large';
    size = 9 + ((seed * 43) % 60) / 10;
    duration = 5 + ((seed * 37) % 6);
    opacity = 0.35 + ((seed * 17) % 30) / 100;
  }

  const hash = ((seed * 2654435761) >>> 0) % 10000;
  const left = (hash % 10000) / 100;
  const drift = ((seed * 53) % 24) - 12;
  const delay = -(((seed * 7919) >>> 0) % 50);
  const highlightAngle = 300 + ((seed * 71) % 40);

  return {
    delay,
    drift,
    duration,
    highlightAngle,
    left,
    mobileHidden: index >= 300,
    opacity,
    size,
    tier,
  };
});

export default function ParticleBackground() {
  return (
    <div className="elevated-particle-background" aria-hidden="true">
      <div className="elevated-particle-vignette" />
      <div className="elevated-bubble-layer">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="elevated-bubble"
            data-tier={b.tier}
            data-mobile-hidden={b.mobileHidden ? 'true' : undefined}
            style={
              {
                '--b-delay': `${b.delay}s`,
                '--b-drift': `${b.drift}px`,
                '--b-dur': `${b.duration}s`,
                '--b-left': `${b.left}%`,
                '--b-opacity': b.opacity,
                '--b-size': `${b.size}px`,
                '--b-highlight': `${b.highlightAngle}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
