import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-navy-200">404</p>
        <h1 className="text-2xl font-bold text-navy-900 mt-4 mb-2">Page Not Found</h1>
        <p className="text-navy-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button variant="outline" size="md">
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>
          </Link>
          <Link to="/">
            <Button variant="primary" size="md">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
