import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'leave'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100);
    const t2 = setTimeout(() => setPhase('leave'), 2400);
    const t3 = setTimeout(() => onDone(), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, hsl(0 60% 12%) 0%, hsl(0 0% 3%) 70%)',
        opacity: phase === 'leave' ? 0 : 1,
        transform: phase === 'leave' ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.5s ease-in, transform 0.5s ease-in',
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(180,30,30,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-[-5%] right-[-15%] w-[50vw] h-[50vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(140,20,20,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Top greeting */}
      <div className="relative z-10 pt-20 text-center"
        style={{ opacity: phase === 'enter' ? 0 : 1, transform: phase === 'enter' ? 'translateY(-16px)' : 'translateY(0)', transition: 'all 0.7s ease 0.3s' }}>
        <p className="text-xs tracking-[0.5em] text-white/40 uppercase">Добро пожаловать в</p>
      </div>

      {/* Logo block */}
      <div className="relative z-10 flex flex-col items-center"
        style={{ opacity: phase === 'enter' ? 0 : 1, transform: phase === 'enter' ? 'scale(0.7)' : 'scale(1)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>

        {/* Logo ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(200,40,40,0.2)', animationDuration: '2s' }} />
          <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl relative"
            style={{ background: 'linear-gradient(135deg, hsl(0 80% 55%) 0%, hsl(0 70% 35%) 100%)', boxShadow: '0 0 60px rgba(180,30,30,0.5), 0 20px 40px rgba(0,0,0,0.5)' }}>
            <span className="font-display text-5xl font-bold text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>A</span>
          </div>
        </div>

        <h1 className="font-display font-bold text-white tracking-[0.25em]" style={{ fontSize: 42 }}>AURUM</h1>
        <p className="text-white/40 text-xs tracking-[0.35em] uppercase mt-2">Luxury Marketplace</p>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>

      {/* Bottom tagline + loader */}
      <div className="relative z-10 pb-16 flex flex-col items-center gap-6"
        style={{ opacity: phase === 'enter' ? 0 : 1, transform: phase === 'enter' ? 'translateY(16px)' : 'translateY(0)', transition: 'all 0.7s ease 0.5s' }}>
        <p className="text-white/25 text-xs text-center leading-relaxed max-w-[220px]">
          Эксклюзивные товары<br />от мировых брендов
        </p>

        {/* Loading bar */}
        <div className="w-32 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, hsl(0 80% 55%), hsl(0 60% 70%))',
              width: phase === 'show' ? '100%' : '0%',
              transition: 'width 2s ease',
            }} />
        </div>
      </div>
    </div>
  );
}
