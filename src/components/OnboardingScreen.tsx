import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  onDone: (name: string, phone: string) => void;
  existingUser?: boolean;
}

const SLIDES = [
  {
    emoji: '🛍️',
    title: 'Премиальный\nкаталог',
    desc: 'Тысячи эксклюзивных товаров от мировых брендов с доставкой по всей России',
    bg: 'from-primary/25 to-transparent',
  },
  {
    emoji: '🔒',
    title: 'Гарантия\nподлинности',
    desc: 'Каждый товар проверен нашими экспертами и имеет сертификат оригинальности',
    bg: 'from-rose-900/35 to-transparent',
  },
  {
    emoji: '🚚',
    title: 'Доставка\nза 24 часа',
    desc: 'Курьер в белых перчатках. Премиальная упаковка. Приятные сюрпризы внутри',
    bg: 'from-zinc-800/50 to-transparent',
  },
];

type Phase = 'slides' | 'phone' | 'code' | 'name';

export default function OnboardingScreen({ onDone, existingUser = false }: Props) {
  const [step, setStep] = useState(existingUser ? 'phone' as Phase : 'slides' as Phase);
  const [slideIdx, setSlideIdx] = useState(0);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [codeTimer, setCodeTimer] = useState(60);
  const [leaving, setLeaving] = useState(false);
  const codeRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Format phone as +7 (XXX) XXX-XX-XX
  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    let formatted = '';
    if (digits.length > 0) formatted += '(' + digits.slice(0, 3);
    if (digits.length >= 3) formatted += ') ' + digits.slice(3, 6);
    if (digits.length >= 6) formatted += '-' + digits.slice(6, 8);
    if (digits.length >= 8) formatted += '-' + digits.slice(8, 10);
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  const sendCode = () => {
    if (phone.length < 10) return;
    setStep('code');
    let t = 60;
    const interval = setInterval(() => {
      t--;
      setCodeTimer(t);
      if (t <= 0) clearInterval(interval);
    }, 1000);
    setTimeout(() => codeRefs[0].current?.focus(), 300);
  };

  const handleCodeInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[i] = val.slice(-1);
    setCode(newCode);
    if (val && i < 3) codeRefs[i + 1].current?.focus();
    if (newCode.every((d) => d !== '')) {
      setTimeout(() => setStep('name'), 300);
    }
  };

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      codeRefs[i - 1].current?.focus();
    }
  };

  const finish = () => {
    if (!name.trim()) return;
    setLeaving(true);
    setTimeout(() => onDone(name.trim(), '+7' + phone), 400);
  };

  const slideGo = (idx: number) => setSlideIdx(idx);

  return (
    <div
      className="fixed inset-0 z-[90] bg-background flex flex-col max-w-md mx-auto overflow-hidden"
      style={{ opacity: leaving ? 0 : 1, transform: leaving ? 'translateY(16px)' : 'translateY(0)', transition: 'all 0.4s ease' }}
    >
      {/* BG gradient */}
      <div className={`absolute top-0 left-0 right-0 h-80 bg-gradient-to-b ${SLIDES[Math.min(slideIdx, 2)].bg} transition-all duration-700 pointer-events-none`} />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* SLIDES */}
      {step === 'slides' && (
        <>
          <div className="flex justify-between items-center px-6 pt-14 relative z-10">
            <div className="flex gap-1.5">
              {SLIDES.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === slideIdx ? 'w-6 bg-primary' : 'w-1.5 bg-white/20'}`} />
              ))}
            </div>
            <button onClick={() => setStep('phone')} className="text-xs text-white/40 px-2 py-1">Пропустить</button>
          </div>

          <div key={slideIdx} className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-10 animate-fade-in">
            <div className="text-7xl mb-8" style={{ filter: 'drop-shadow(0 8px 24px rgba(200,40,40,0.3))' }}>
              {SLIDES[slideIdx].emoji}
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight mb-4 whitespace-pre-line">{SLIDES[slideIdx].title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{SLIDES[slideIdx].desc}</p>
          </div>

          <div className="relative z-10 px-6 pb-14 flex flex-col gap-3">
            {slideIdx < SLIDES.length - 1 ? (
              <button onClick={() => slideGo(slideIdx + 1)} className="w-full h-14 rounded-2xl gold-gradient text-white font-semibold text-base flex items-center justify-center gap-2">
                Далее <Icon name="ArrowRight" size={18} />
              </button>
            ) : (
              <button onClick={() => setStep('phone')} className="w-full h-14 rounded-2xl gold-gradient text-white font-semibold text-base">
                Начать покупки
              </button>
            )}
            <div className="flex justify-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => slideGo(i)}>
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIdx ? 'w-5 bg-primary' : 'w-1.5 bg-white/15'}`} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* PHONE */}
      {step === 'phone' && (
        <div className="flex-1 flex flex-col px-6 pt-16 relative z-10 animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl gold-gradient mb-6 shadow-lg shadow-primary/30">
            <Icon name="Smartphone" size={30} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">Войти или<br />зарегистрироваться</h2>
          <p className="text-muted-foreground text-sm mb-8">Введите номер телефона — пришлём код подтверждения</p>

          <div className="flex items-center gap-3 glass border border-border rounded-2xl px-4 h-14 mb-3 focus-within:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 border-r border-border pr-3 shrink-0">
              <span className="text-base">🇷🇺</span>
              <span className="text-sm font-medium">+7</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              value={formatPhone(phone)}
              onChange={handlePhoneChange}
              placeholder="(900) 000-00-00"
              className="bg-transparent outline-none text-base flex-1 placeholder:text-muted-foreground"
            />
          </div>

          <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
            Нажимая «Получить код», вы соглашаетесь с{' '}
            <span className="text-primary cursor-pointer">Условиями использования</span> и{' '}
            <span className="text-primary cursor-pointer">Политикой конфиденциальности</span>
          </p>

          <button
            onClick={sendCode}
            disabled={phone.length < 10}
            className={`w-full h-14 rounded-2xl font-semibold text-base transition-all ${phone.length >= 10 ? 'gold-gradient text-white shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground'}`}
          >
            Получить код
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">или войти через</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex gap-3">
            {[{ label: 'VK ID', emoji: '🔵' }, { label: 'Госуслуги', emoji: '🏛️' }, { label: 'Сбер ID', emoji: '🟢' }].map((s) => (
              <button key={s.label} onClick={() => setStep('name')} className="flex-1 h-11 rounded-xl glass border border-border text-xs flex items-center justify-center gap-1.5 flex-col">
                <span className="text-base">{s.emoji}</span>
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CODE */}
      {step === 'code' && (
        <div className="flex-1 flex flex-col px-6 pt-16 relative z-10 animate-fade-in">
          <button onClick={() => setStep('phone')} className="w-9 h-9 rounded-full glass border border-border flex items-center justify-center mb-6">
            <Icon name="ChevronLeft" size={20} />
          </button>
          <h2 className="font-display text-3xl font-bold mb-2">Введите код</h2>
          <p className="text-muted-foreground text-sm mb-8">Отправили SMS на +7 {formatPhone(phone)}</p>

          <div className="flex gap-3 mb-6">
            {code.map((d, i) => (
              <input
                key={i}
                ref={codeRefs[i]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleCodeInput(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
                className={`flex-1 h-16 rounded-2xl text-center text-2xl font-bold outline-none transition-all border ${
                  d ? 'border-primary bg-primary/10 text-primary' : 'border-border glass'
                }`}
              />
            ))}
          </div>

          {codeTimer > 0 ? (
            <p className="text-sm text-muted-foreground text-center">Повторить через {codeTimer} с</p>
          ) : (
            <button onClick={sendCode} className="text-sm text-primary text-center w-full">Отправить снова</button>
          )}

          <div className="mt-auto pb-8">
            <p className="text-xs text-muted-foreground text-center">Для теста введите любые 4 цифры</p>
          </div>
        </div>
      )}

      {/* NAME */}
      {step === 'name' && (
        <div className="flex-1 flex flex-col px-6 pt-16 relative z-10 animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 rounded-full gold-gradient mb-6 shadow-xl shadow-primary/30">
            <Icon name="User" size={28} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">Почти готово!</h2>
          <p className="text-muted-foreground text-sm mb-8">Как вас зовут? Персонализируем вашу ленту</p>

          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && finish()}
            placeholder="Ваше имя"
            className="w-full glass border border-border rounded-2xl px-5 h-14 text-lg outline-none placeholder:text-muted-foreground focus:border-primary/50 transition-colors mb-4"
          />

          <button onClick={finish} disabled={!name.trim()} className={`w-full h-14 rounded-2xl font-semibold text-base transition-all ${name.trim() ? 'gold-gradient text-white shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground'}`}>
            Войти в AURUM
          </button>
        </div>
      )}
    </div>
  );
}
