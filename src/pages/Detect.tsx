
import { useState } from 'react';
import { Eraser, Sparkles, Send, ShieldAlert, Info } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import AlertMessage from '@/components/ui/AlertMessage';
import ResultCard from '@/components/ui/ResultCard';
import DevModeBanner from '@/components/ui/DevModeBanner';
import { predictNews, searchEvidence } from '@/services/api';
import type { EvidenceSearchResponse } from '@/services/api';
import type { PredictionResponse } from '@/types';

const MAX_CHARS = 5000;
const MIN_CHARS = 10;
const MAX_EVIDENCE_CHARS = 1000;

const SAMPLE_TEXT = `Scientists at the National Oceanic and Atmospheric Administration have released a new report showing that global temperatures in 2024 were the highest on record. The report, published in a peer-reviewed journal, analyzed data from over 7,000 weather stations worldwide.`;

export default function Detect() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [saved, setSaved] = useState(false);

  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [evidenceResult, setEvidenceResult] =
    useState<EvidenceSearchResponse | null>(null);

  const isBackendConnected = !!import.meta.env.VITE_API_BASE_URL;

  const charCount = text.length;
  const tooLong = charCount > MAX_CHARS;
  const tooShort = charCount > 0 && charCount < MIN_CHARS;

  const canSubmit =
    charCount >= MIN_CHARS &&
    charCount <= MAX_CHARS &&
    !loading;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);
    setEvidenceLoading(false);
    setError(null);
    setEvidenceError(null);
    setResult(null);
    setEvidenceResult(null);
    setSaved(false);

    // Step 1: Run ML prediction.
    try {
      const prediction = await predictNews(text.trim());

      setResult(prediction);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during prediction.'
      );

      setLoading(false);
      return;
    }

    // Step 2: Search for supporting evidence.
    if (text.trim().length > MAX_EVIDENCE_CHARS) {
      setEvidenceError(
        'Evidence search supports claims up to 1000 characters. ML prediction was completed successfully.'
      );
      setLoading(false);
      return;
    }

    setEvidenceLoading(true);

    try {
      const evidence = await searchEvidence(text.trim());
      setEvidenceResult(evidence);
    } catch (err) {
      setEvidenceError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during evidence search.'
      );
    } finally {
      setEvidenceLoading(false);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setError(null);
    setResult(null);
    setSaved(false);
    setEvidenceError(null);
    setEvidenceResult(null);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setSaved(false);
    setEvidenceError(null);
    setEvidenceResult(null);
  };

  const handleSample = () => {
    setText(SAMPLE_TEXT);
    setError(null);
    setResult(null);
    setSaved(false);
    setEvidenceError(null);
    setEvidenceResult(null);
  };

  return (
    <DashboardLayout>
      {!isBackendConnected && (
        <div className="mb-4">
          <DevModeBanner />
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">
          Fake News Detection
        </h1>

        <p className="text-navy-500 mt-1 max-w-2xl">
          Paste a news headline or article below. The system will use a
          machine learning classifier to predict whether the content is
          likely real or fake and search the web for relevant evidence.
        </p>
      </div>

      {result ? (
        <div className="max-w-3xl">
          <ResultCard result={result} onReset={handleReset} />

          {saved && (
            <p className="mt-3 text-sm text-success-600 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              This analysis has been saved to your history.
            </p>
          )}

          {/* Evidence Search Results */}
          <section className="mt-6 card-base p-6">
            <h2 className="text-lg font-semibold text-navy-900">
              Retrieved Web Evidence
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              These sources were retrieved through a web search. They
              provide reference material but have not been independently
              verified by TruthLens.
            </p>

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Search relevance indicates how closely a result matches
                your search query. It does not indicate whether the source
                supports or contradicts the claim.
              </p>
            </div>

            {evidenceLoading && (
              <p className="mt-3 text-sm text-blue-600">
                Searching the web and retrieving relevant sources...
              </p>
            )}

            {evidenceError && (
              <AlertMessage
                type="warning"
                title="Evidence search unavailable"
                className="mt-4"
              >
                {evidenceError}
              </AlertMessage>
            )}

            {evidenceResult && (
              <>
                <p className="mt-3 text-sm text-navy-500">
                  {evidenceResult.message}
                </p>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  Sources found: {evidenceResult.sources.length}
                </p>

                {evidenceResult.sources.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-500">
                    No relevant sources were found. Try a different claim.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {evidenceResult.sources.map((source, index) => (
                      <article
                        key={`${source.url}-${index}`}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <h3 className="font-semibold text-navy-900">
                          {index + 1}. {source.title || 'Untitled source'}
                        </h3>

                        <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                          {source.content}
                        </p>

                        {source.published_date && (
                          <p className="mt-2 text-xs text-gray-500">
                            Published: {source.published_date}
                          </p>
                        )}

                        <div className="mt-3 rounded-md bg-gray-50 p-3">
                          <p className="text-xs font-medium text-navy-700">
                            Search relevance score
                          </p>

                          <p className="mt-1 text-sm font-semibold text-navy-900">
                            {typeof source.score === 'number'
                              ? source.score.toFixed(2)
                              : 'Not available'}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            This score measures search relevance only.
                            It is not a truth or accuracy score.
                          </p>
                        </div>

                        {/^https?:\/\//i.test(source.url) && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Visit source →
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}

            {!evidenceResult && !evidenceError && !evidenceLoading && (
              <p className="mt-3 text-sm text-gray-500">
                No evidence search has been completed.
              </p>
            )}
          </section>

          <div className="mt-4 flex items-start gap-2.5 bg-warning-50 border border-warning-200 rounded-lg p-4">
            <ShieldAlert className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-warning-800 leading-relaxed">
              Retrieved sources may support, contradict, or simply discuss
              the submitted claim. TruthLens does not automatically
              determine which of these applies. Review reliable sources
              before reaching a conclusion.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl">
          <div className="card-base p-6">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="news-text" className="label-base mb-0">
                  News Article or Headline
                </label>

                <span
                  className={`text-xs font-medium ${
                    tooLong
                      ? 'text-danger-600'
                      : tooShort
                        ? 'text-warning-600'
                        : 'text-gray-400'
                  }`}
                >
                  {charCount} / {MAX_CHARS}
                </span>
              </div>

              <textarea
                id="news-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type a news article, headline, or any text you want to analyze..."
                rows={10}
                maxLength={MAX_CHARS + 100}
                aria-describedby="text-help"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-navy-900 placeholder-gray-400 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y font-mono text-sm leading-relaxed"
              />

              <div
                id="text-help"
                className="mt-1.5 flex items-center justify-between"
              >
                <p className="text-xs text-gray-400">
                  Minimum {MIN_CHARS} characters required. Maximum{' '}
                  {MAX_CHARS} characters.
                </p>

                <button
                  onClick={handleSample}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Use sample text
                </button>
              </div>
            </div>

            {tooShort && (
              <AlertMessage type="warning" className="mb-4">
                Text is too short. Please enter at least {MIN_CHARS}{' '}
                characters for a meaningful analysis.
              </AlertMessage>
            )}

            {tooLong && (
              <AlertMessage type="error" className="mb-4">
                Text exceeds the {MAX_CHARS} character limit. Please
                shorten it.
              </AlertMessage>
            )}

            {error && (
              <AlertMessage
                type="error"
                title="Prediction error"
                className="mb-4"
              >
                {error}
              </AlertMessage>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleSubmit}
                loading={loading}
                disabled={!canSubmit}
                className="flex-1"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Analyzing...' : 'Detect News'}
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={handleClear}
                disabled={loading || charCount === 0}
              >
                <Eraser className="h-4 w-4" />
                Clear Text
              </Button>
            </div>

            {loading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-navy-500">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse-soft" />
                  <span
                    className="h-2 w-2 bg-blue-400 rounded-full animate-pulse-soft"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="h-2 w-2 bg-blue-400 rounded-full animate-pulse-soft"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
                {result
                  ? 'Searching for supporting evidence...'
                  : 'Sending text to the prediction server...'}
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400 italic max-w-2xl">
            Predictions are based on learned text patterns and do not
            guarantee factual verification. Always verify important claims
            using reliable sources.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
