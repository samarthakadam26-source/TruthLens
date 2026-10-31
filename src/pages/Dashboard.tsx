import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  History as HistoryIcon,
  User,
  Plus,
  ArrowRight,
  FileText,
  BarChart3,
  Cpu,
  CheckCircle2,
  Info,
  Clock,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import DevModeBanner from '@/components/ui/DevModeBanner';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats } from '@/services/api';
import type { DetectionRecord } from '@/types';
import { formatDateTime, truncate, classNames } from '@/utils';
import { CheckCircle2 as CheckIcon, XCircle } from 'lucide-react';

const isBackendConnected = !!import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<DetectionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stats = await getDashboardStats();
        setHistory(stats.recent);
        setTotal(stats.total);
      } catch {
        // show empty state
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const quickCards = [
    {
      icon: Search,
      title: 'Fake News Detection',
      desc: 'Analyze news text with the ML model',
      to: '/detect',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: HistoryIcon,
      title: 'Detection History',
      desc: 'Review your past analyses',
      to: '/history',
      color: 'bg-navy-100 text-navy-700',
    },
    {
      icon: User,
      title: 'Profile',
      desc: 'View and manage your account',
      to: '/profile',
      color: 'bg-success-50 text-success-600',
    },
  ];

  const workflowSteps = [
    { icon: FileText, label: 'Enter text' },
    { icon: BarChart3, label: 'Extract features' },
    { icon: Cpu, label: 'Classify' },
    { icon: CheckCircle2, label: 'Get result' },
  ];

  return (
    <DashboardLayout>
      {!isBackendConnected && <div className="mb-4"><DevModeBanner /></div>}

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">
          Welcome back{user?.fullName ? `, ${user.fullName}` : ''}!
        </h1>
        <p className="text-navy-500 mt-1">Here is your TruthLens dashboard overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card-base p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-blue-50">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">{loading ? '\u2014' : total}</p>
              <p className="text-sm text-navy-500">Total analyses</p>
            </div>
          </div>
        </div>
        <div className="card-base p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-success-50">
              <CheckIcon className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">
                {loading ? '\u2014' : history.filter((r) => r.prediction === 'REAL').length}
              </p>
              <p className="text-sm text-navy-500">Recent REAL</p>
            </div>
          </div>
        </div>
        <div className="card-base p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-danger-50">
              <XCircle className="h-5 w-5 text-danger-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">
                {loading ? '\u2014' : history.filter((r) => r.prediction === 'FAKE').length}
              </p>
              <p className="text-sm text-navy-500">Recent FAKE</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Detection CTA */}
      <div className="card-base p-6 mb-8 bg-gradient-to-br from-navy-800 to-navy-950 border-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Analyze a news article</h2>
            <p className="text-sm text-navy-100/70">
              Paste any news headline or article to get an instant ML-powered prediction.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={() => navigate('/detect')}>
            <Plus className="h-4 w-4" /> New Detection
          </Button>
        </div>
      </div>

      {/* Quick access cards */}
      <h2 className="text-lg font-semibold text-navy-900 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.to}
              className="card-base p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`flex items-center justify-center rounded-lg h-10 w-10 mb-3 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-navy-900 mb-1 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-navy-500">{card.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Two column: recent history + workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent history */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-navy-900">Recent Detections</h2>
            {history.length > 0 && (
              <Link to="/history" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="card-base p-8 text-center text-navy-400 text-sm">Loading recent detections...</div>
          ) : history.length === 0 ? (
            <div className="card-base">
              <EmptyState
                icon={<HistoryIcon className="h-8 w-8" />}
                title="No analyses yet"
                message="Start your first fake news detection to see results here."
                action={
                  <Button variant="secondary" size="sm" onClick={() => navigate('/detect')}>
                    <Plus className="h-4 w-4" /> Start Detection
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => {
                const isReal = record.prediction === 'REAL';
                return (
                  <Link
                    key={record.id}
                    to={`/history/${record.id}`}
                    className="card-base p-4 hover:shadow-card-hover transition-shadow block"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={classNames(
                          'flex items-center justify-center rounded-full h-8 w-8 flex-shrink-0',
                          isReal ? 'bg-success-100' : 'bg-danger-100'
                        )}
                      >
                        {isReal ? (
                          <CheckIcon className="h-4 w-4 text-success-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-danger-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={classNames(
                              'text-xs font-bold uppercase px-2 py-0.5 rounded',
                              isReal ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
                            )}
                          >
                            {record.prediction}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formatDateTime(record.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-navy-600 line-clamp-1">{truncate(record.news_text, 100)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Workflow info card */}
        <div>
          <h2 className="text-lg font-semibold text-navy-900 mb-4">How It Works</h2>
          <div className="card-base p-5">
            <div className="flex items-start gap-2.5 mb-4">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy-500">
                The system processes news text through an NLP pipeline to generate predictions.
              </p>
            </div>
            <div className="space-y-3">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-lg h-8 w-8 bg-gray-50 border border-gray-200 flex-shrink-0">
                      <Icon className="h-4 w-4 text-navy-500" />
                    </div>
                    <span className="text-sm text-navy-600">
                      <span className="font-medium text-navy-400 mr-1.5">{index + 1}.</span>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic">
                Predictions are based on learned text patterns and do not guarantee factual verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
