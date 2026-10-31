import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

const sizeMap = {
  sm: { icon: 'h-7 w-7', text: 'text-lg', iconBox: 'h-8 w-8' },
  md: { icon: 'h-8 w-8', text: 'text-xl', iconBox: 'h-10 w-10' },
  lg: { icon: 'h-10 w-10', text: 'text-2xl', iconBox: 'h-12 w-12' },
};

export default function Logo({ size = 'md', showText = true, light = false }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-navy-700 to-navy-900 ${s.iconBox} shadow-card`}
      >
        <ShieldCheck className={`${s.icon} text-blue-300`} />
      </div>
      {showText && (
        <div className="leading-tight">
          <span className={`${s.text} font-bold ${light ? 'text-white' : 'text-navy-900'} block`}>
            TruthLens
          </span>
          <span className={`text-[10px] uppercase tracking-wider font-medium ${light ? 'text-blue-200/70' : 'text-blue-600'}`}>
            Fake News Detection
          </span>
        </div>
      )}
    </div>
  );
}
