
import { CheckCircle2, XCircle, ShieldAlert, Info } from 'lucide-react';
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
          <Icon
            className={classNames(
              'h-7 w-7',
              isReal ? 'text-success-600' : 'text-danger-600'
            )}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            ML Model Prediction
          </p>
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
          ? 'The machine learning model classified this text as REAL based on patterns learned during training.'
          : 'The machine learning model classified this text as FAKE based on patterns learned during training.'}
      </p>

      {typeof result.confidence === 'number' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-navy-700">
              Model confidence score
            </span>
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
              style={{
                width: `${Math.min(
                  Math.max(result.confidence * 100, 0),
                  100
                )}%`
              }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            This score represents the model's confidence in its selected
            class. It is not a calibrated probability that the claim is
            factually true or false.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          This prediction is based on the model's training data. Its
          accuracy may vary depending on the topic and type of claim.
        </p>
      </div>

      <div className="flex items-start gap-2.5 bg-warning-50 border border-warning-200 rounded-lg p-3 mb-5">
        <ShieldAlert className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-warning-800 leading-relaxed">
          Do not treat this prediction as a verified factual verdict.
          Review reliable sources before deciding whether a claim is true
          or false.
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
