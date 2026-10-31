import { CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateTime, truncate, classNames } from '@/utils';
import type { DetectionRecord } from '@/types';
import { Trash2 } from 'lucide-react';

interface HistoryItemProps {
  record: DetectionRecord;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ record, onDelete }: HistoryItemProps) {
  const isReal = record.prediction === 'REAL';

  return (
    <div className="card-base p-4 hover:shadow-card-hover transition-shadow group">
      <div className="flex items-start gap-3">
        <div
          className={classNames(
            'flex items-center justify-center rounded-full h-10 w-10 flex-shrink-0',
            isReal ? 'bg-success-100' : 'bg-danger-100'
          )}
        >
          {isReal ? (
            <CheckCircle2 className="h-5 w-5 text-success-600" />
          ) : (
            <XCircle className="h-5 w-5 text-danger-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={classNames(
                'text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded',
                isReal ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
              )}
            >
              {record.prediction}
            </span>
            <span className="text-xs text-gray-400">{formatDateTime(record.created_at)}</span>
          </div>
          <p className="text-sm text-navy-600 line-clamp-2">{truncate(record.news_text, 160)}</p>

          <div className="flex items-center gap-3 mt-3">
            <Link
              to={`/history/${record.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View details
            </Link>
            <button
              onClick={() => onDelete(record.id)}
              aria-label={`Delete detection from ${formatDateTime(record.created_at)}`}
              className="text-sm font-medium text-gray-400 hover:text-danger-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
