'use client';

export default function GoldBlobBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{
        height: '100vh',
        opacity: 0.15,
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
      }}
    >
      <div className="gold-blob-bg" />
    </div>
  );
}
