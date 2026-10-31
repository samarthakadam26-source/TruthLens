import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  altLinkText: string;
  altLinkTo: string;
  altLinkLabel: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  altLinkText,
  altLinkTo,
  altLinkLabel,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/">
            <Logo size="md" light />
          </Link>
          <div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Detect Potential Fake News with Machine Learning
            </h2>
            <p className="text-navy-100/80 text-lg">
              TruthLens uses NLP and TF-IDF feature extraction to classify news text as real or fake.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-blue-200">
              <ShieldCheck className="h-5 w-5" />
              <span>Predictions are based on learned text patterns and do not guarantee factual verification.</span>
            </div>
          </div>
          <p className="text-xs text-navy-100/40">
            &copy; {new Date().getFullYear()} TruthLens. A B.Tech IT PBL Project.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/">
              <Logo size="md" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-navy-900 mb-1.5">{title}</h1>
          <p className="text-sm text-navy-500 mb-6">{subtitle}</p>

          {children}

          <p className="mt-6 text-center text-sm text-navy-500">
            {altLinkText}{' '}
            <Link to={altLinkTo} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              {altLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
