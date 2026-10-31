import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, ShieldAlert, Calendar, Clock, Gauge } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import AlertMessage from '@/components/ui/AlertMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { fetchDetectionById } from '@/services/api';
import type { DetectionRecord } from '@/types';
import { formatDateTime, classNames } from '@/utils';

export default function DetectionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<DetectionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await fetchDetectionById(id);
        if (!data) {
          setError('This detection record could not be found or you do not have permission to view it.');
        } else {
          setRecord(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load detection details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" label="Loading detection details..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !record) {
    return (
      <DashboardLayout>
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to History
        </Link>
        <AlertMessage type="error" title="Not found">
          {error ?? 'This detection record could not be found.'}
        </AlertMessage>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/history')}>
          Go to History
        </Button>
      </DashboardLayout>
    );
  }

  const isReal = record.prediction === 'REAL';

  return (
    <DashboardLayout>
      <Link to="/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to History
      </Link>

      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-navy-900 mb-1">Detection Details</h1>
        <p className="text-navy-500 mb-6 text-sm">Full analysis record for this detection.</p>

        {/* Result banner */}
        <div
          className={classNames(
            'card-base p-6 mb-6 border-l-4',
            isReal ? 'border-l-success-500 bg-success-50/50' : 'border-l-danger-500 bg-danger-50/50'
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={classNames(
                'flex items-center justify-center rounded-full h-14 w-14 flex-shrink-0',
                isReal ? 'bg-success-100' : 'bg-danger-100'
              )}
            >
              {isReal ? (
                <CheckCircle2 className="h-7 w-7 text-success-600" />
              ) : (
                <XCircle className="h-7 w-7 text-danger-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Predicted Class</p>
              <p className={classNames('text-2xl font-bold', isReal ? 'text-success-700' : 'text-danger-700')}>
                {record.prediction}
              </p>
              <p className="text-sm text-navy-500 mt-0.5">
                {isReal
                  ? 'The model classified this text as likely real based on learned patterns.'
                  : 'The model classified this text as likely fake based on learned patterns.'}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="card-base p-4">
            <div className="flex items-center gap-2 text-navy-500 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider font-medium">Date & Time</span>
            </div>
            <p className="text-sm font-medium text-navy-900">{formatDateTime(record.created_at)}</p>
          </div>
          {typeof record.confidence === 'number' && (
            <div className="card-base p-4">
              <div className="flex items-center gap-2 text-navy-500 mb-1">
                <Gauge className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Model Confidence</span>
              </div>
              <p className="text-sm font-medium text-navy-900">{(record.confidence * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>

        {/* Full text */}
        <div className="card-base p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-navy-500" />
            <h2 className="text-sm font-semibold text-navy-900 uppercase tracking-wider">Submitted News Text</h2>
          </div>
          <p className="text-sm text-navy-700 leading-relaxed whitespace-pre-wrap font-mono bg-gray-50 rounded-lg p-4 border border-gray-100">
            {record.news_text}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
          <ShieldAlert className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-warning-800 leading-relaxed">
            This is a machine learning prediction, not a guarantee of factual truth. Verify important claims using reliable sources.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => navigate('/history')}>
          <ArrowLeft className="h-4 w-4" /> Back to History
        </Button>
      </div>
    </DashboardLayout>
  );
}
