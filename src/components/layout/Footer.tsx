import { Link } from 'react-router-dom';
import { Github, ShieldCheck } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo size="sm" />
            <p className="mt-3 text-sm text-navy-500 max-w-xs">
              An AI-powered tool that analyzes news text using machine learning to identify potential misinformation.
            </p>
            <p className="mt-3 text-xs text-gray-400 max-w-xs italic">
              Predictions are based on learned text patterns and do not guarantee factual verification.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-navy-900 mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-navy-500 hover:text-navy-900 transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-navy-500 hover:text-navy-900 transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-navy-500 hover:text-navy-900 transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="text-navy-500 hover:text-navy-900 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-navy-900 mb-3">Built With</h3>
            <ul className="space-y-2 text-sm text-navy-500">
              <li>Python & Flask</li>
              <li>NLP & TF-IDF</li>
              <li>Scikit-learn</li>
              <li>React & Vite</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} TruthLens. A B.Tech IT PBL Project.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Educational use only</span>
            <Github className="h-4 w-4 ml-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}
