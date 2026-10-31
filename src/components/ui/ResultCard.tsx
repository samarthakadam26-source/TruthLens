import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { classNames } from '@/utils';
import type { PredictionResponse } from '@/types';

interface ResultCardProps {
  result: PredictionResponse;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const isReal = result.prediction === 'REAL';
  const Icon = isReal ? CheckCircle2 : XCircle;

  return (
    <div className="card-base p-6 animate-slide-up">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={classNames(
            'flex items-center justify-center rounded-full h-14 w-14 flex-shrink-0',
            isReal ? 'bg-success-100' : 'bg-danger-100'
          )}
        >
          <Icon className={classNames('h-7 w-7', isReal ? 'text-success-600' : 'text-danger-600')} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Predicted Class</p>
          <p
            className={classNames(
              'text-2xl font-bold',
              isReal ? 'text-success-700' : 'text-danger-700'
            )}
          >
            {result.prediction}
          </p>
        </div>
      </div>

      <p className="text-sm text-navy-600 mb-4">
        {isReal
          ? 'The model classified this text as likely real based on learned patterns in the training data.'
          : 'The model classified this text as likely fake based on learned patterns in the training data.'}
      </p>

      {typeof result.confidence === 'number' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-navy-700">Model confidence</span>
            <span className="text-sm font-semibold text-navy-900">
              {(result.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={classNames(
                'h-full rounded-full transition-all duration-500',
                isReal ? 'bg-success-500' : 'bg-danger-500'
              )}
              style={{ width: `${Math.min(result.confidence * 100, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            This is the model's confidence in its prediction, not the probability that the news is true.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2.5 bg-warning-50 border border-warning-200 rounded-lg p-3 mb-5">
        <ShieldAlert className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-warning-800 leading-relaxed">
          This is a machine learning prediction, not a guarantee of factual truth. Verify important claims using reliable sources.
        </p>
      </div>

      <button
        onClick={onReset}
        className="w-full rounded-lg border-2 border-navy-200 text-navy-700 hover:border-navy-400 hover:text-navy-900 bg-white font-medium text-sm px-4 py-2.5 transition-all duration-200"
      >
        Analyze Another Article
      </button>
    </div>
  );
}
