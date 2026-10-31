import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, History as HistoryIcon, Filter, X } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import AlertMessage from '@/components/ui/AlertMessage';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import HistoryItem from '@/components/ui/HistoryItem';
import { fetchHistory, deleteDetection, clearAllDetections } from '@/services/api';
import type { DetectionRecord } from '@/types';

type FilterType = 'all' | 'REAL' | 'FAKE';

const PAGE_SIZE = 8;

export default function History() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [clearAll, setClearAll] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = records.filter((r) => {
    if (filter !== 'all' && r.prediction !== filter) return false;
    if (search.trim() && !r.news_text.toLowerCase().includes(search.toLowerCase().trim())) return false;
    return true;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const handleDelete = async (id: string) => {
    try {
      await deleteDetection(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record.');
    }
    setDeleteTarget(null);
  };

  const handleClearAll = async () => {
    try {
      await clearAllDetections();
      setRecords([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history.');
    }
    setClearAll(false);
  };

  const filterTabs: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'all', count: records.length },
    { label: 'Real', value: 'REAL', count: records.filter((r) => r.prediction === 'REAL').length },
    { label: 'Fake', value: 'FAKE', count: records.filter((r) => r.prediction === 'FAKE').length },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Detection History</h1>
          <p className="text-navy-500 mt-1">Review and manage your past news analyses.</p>
        </div>
        {records.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setClearAll(true)}>
            <Trash2 className="h-4 w-4" /> Clear History
          </Button>
        )}
      </div>

      {error && (
        <AlertMessage type="error" className="mb-4">
          {error}
        </AlertMessage>
      )}

      {/* Search + Filter */}
      {records.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search by news text..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="input-base pl-10"
              aria-label="Search detection history"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setFilter(tab.value); setVisibleCount(PAGE_SIZE); }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-navy-500 hover:text-navy-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="card-base p-12 text-center text-navy-400 text-sm">Loading your detection history...</div>
      ) : records.length === 0 ? (
        <div className="card-base">
          <EmptyState
            icon={<HistoryIcon className="h-8 w-8" />}
            title="No detections yet"
            message="Your analyzed news articles will appear here once you run your first detection."
            action={
              <Button variant="secondary" size="md" onClick={() => navigate('/detect')}>
                <Search className="h-4 w-4" /> Start Detection
              </Button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-base">
          <EmptyState
            icon={<Filter className="h-8 w-8" />}
            title="No matching results"
            message="No detections match your search or filter. Try adjusting your criteria."
          />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visible.map((record) => (
              <HistoryItem
                key={record.id}
                record={record}
                onDelete={(id) => setDeleteTarget(id)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-6">
              <Button variant="outline" size="md" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                Load More ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Detection"
        message="Are you sure you want to delete this detection record? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={clearAll}
        title="Clear All History"
        message="This will permanently delete all your detection records. This action cannot be undone."
        confirmLabel="Clear All"
        onConfirm={handleClearAll}
        onCancel={() => setClearAll(false)}
      />
    </DashboardLayout>
  );
}
