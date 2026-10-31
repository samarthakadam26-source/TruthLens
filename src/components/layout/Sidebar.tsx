import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  History,
  User,
  LogOut,
  X,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { classNames } from '@/utils';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'New Detection', path: '/detect', icon: Search },
  { label: 'History', path: '/history', icon: History },
  { label: 'Profile', path: '/profile', icon: User },
];

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={classNames(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-navy-900 flex flex-col transition-transform duration-300 lg:translate-x-0 flex-shrink-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-navy-800">
          <Link to="/dashboard" aria-label="TruthLens dashboard">
            <Logo size="sm" light />
          </Link>
          <button
            className="lg:hidden text-navy-100 hover:text-white p-1"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-navy-800">
          <p className="text-xs text-navy-100/50 uppercase tracking-wider font-medium">Signed in as</p>
          <p className="text-sm text-white font-medium truncate mt-0.5">
            {user?.fullName || user?.email || 'User'}
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path === '/history' && location.pathname.startsWith('/history/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={classNames(
                  'sidebar-link-base',
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-navy-800">
          <button
            onClick={handleSignOut}
            className="sidebar-link-base sidebar-link-inactive w-full"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
