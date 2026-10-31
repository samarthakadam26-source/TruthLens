import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Input from '@/components/ui/Input';
import PasswordField from '@/components/ui/PasswordField';
import Button from '@/components/ui/Button';
import AlertMessage from '@/components/ui/AlertMessage';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!fullName.trim()) e.fullName = 'Full name is required.';
    else if (fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters.';
    if (!email.trim()) e.email = 'Email address is required.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!agreeTerms) e.terms = 'You must acknowledge the terms and privacy policy.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const { error } = await signUp(email.trim(), password, fullName.trim());

    if (error) {
      setErrors({ form: error });
      setLoading(false);
    } else {
      // Registration also logs the user in, so go straight to the dashboard.
      navigate('/dashboard');
    }
  };

return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Register to start detecting potential fake news with machine learning."
      altLinkText="Already have an account?"
      altLinkTo="/login"
      altLinkLabel="Login"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.form && (
          <AlertMessage type="error" title="Registration failed">
            {errors.form}
          </AlertMessage>
        )}

        <Input
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          icon={<User className="h-5 w-5" />}
          required
        />

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
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          showToggle
          isVisible={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          hint="Use at least 6 characters with a mix of letters and numbers."
          required
        />

        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          showToggle
          isVisible={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
          required
        />

        <div>
          <label className="flex items-start gap-2.5 text-sm text-navy-600 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              I acknowledge that this is an educational project and I agree to the terms and privacy policy.
            </span>
          </label>
          {errors.terms && (
            <p role="alert" className="mt-1.5 text-sm text-danger-600">
              {errors.terms}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        Your password is securely hashed and is never stored in plain text.
      </p>
    </AuthLayout>
  );
}
