import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import PasswordField from '@/components/ui/PasswordField';
import Button from '@/components/ui/Button';
import AlertMessage from '@/components/ui/AlertMessage';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils';

interface LocationState {
  from?: string;
}

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email address is required.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const { error } = await signIn(email.trim(), password);

    if (error) {
      setErrors({ form: error });
      setLoading(false);
    } else {
      navigate(redirectTo);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to your TruthLens account to continue analyzing news."
      altLinkText="Don't have an account?"
      altLinkTo="/register"
      altLinkLabel="Create one"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errors.form && (
          <AlertMessage type="error" title="Login failed">
            {errors.form}
          </AlertMessage>
        )}

        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail className="h-5 w-5" />}
          required
        />

        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          showToggle
          isVisible={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Remember me
          </label>
        </div>

        <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        Your password is securely hashed and is never stored in plain text.
      </p>
    </AuthLayout>
  );
}
