import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/#features' },
    { label: 'How It Works', path: '/#how-it-works' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" aria-label="TruthLens home">
            <Logo size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="nav-link-base text-sm">
                {link.label}
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/register')}>
              Register
            </Button>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6 text-navy-800" /> : <Menu className="h-6 w-6 text-navy-800" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-slide-down">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-navy-700 hover:bg-gray-50 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setMobileOpen(false); navigate('/login'); }}>
                Login
              </Button>
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setMobileOpen(false); navigate('/register'); }}>
                Register
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
