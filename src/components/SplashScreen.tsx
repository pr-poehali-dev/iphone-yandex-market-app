import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1800);
    const t2 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-500 ${leaving ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 rounded-full bg-primary/10 blur-[80px]" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Logo */}
      <div className="relative flex flex-col items-center animate-splash-logo">
        {/* Ring */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring" style={{ animationDelay: '0.4s' }} />
          <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center shadow-2xl">
            <span className="font-display text-4xl font-bold text-white tracking-tight">A</span>
          </div>
        </div>

        <h1 className="font-display text-5xl font-bold tracking-widest gold-text">AURUM</h1>
        <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase mt-2">Премиальный маркетплейс</p>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/60"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
