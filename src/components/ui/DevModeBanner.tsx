import { Info } from 'lucide-react';

export default function DevModeBanner() {
  return (
    <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-2.5 text-sm text-blue-800">
      <Info className="h-4 w-4 flex-shrink-0" />
      <span>
        <strong>Development mode:</strong> The Flask prediction backend is not connected. Predictions are unavailable until the backend is running.
      </span>
    </div>
  );
}
