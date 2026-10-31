import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Save, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AlertMessage from '@/components/ui/AlertMessage';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils';

export default function Profile() {
  const { user, updateFullName, signOut } = useAuth();
  const navigate = useNavigate();

  const [editName, setEditName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.fullName ?? '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault();
    if (savingName) return;
    if (nameValue.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      return;
    }

    setSavingName(true);
    setNameError(null);
    const { error } = await updateFullName(nameValue.trim());
    if (error) {
      setNameError(error);
    } else {
      setEditName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    }
    setSavingName(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Profile</h1>
        <p className="text-navy-500 mt-1">View and manage your account information.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile card */}
        <div className="card-base p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center rounded-full h-16 w-16 bg-gradient-to-br from-navy-700 to-navy-900">
              <User className="h-8 w-8 text-blue-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900">{user?.fullName || 'User'}</h2>
              <p className="text-sm text-navy-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email - read only */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Email Address</p>
                <p className="text-sm font-medium text-navy-900">{user?.email}</p>
              </div>
              <span className="text-xs text-gray-400 italic">Read-only</span>
            </div>

            {/* Created date */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account Created</p>
                <p className="text-sm font-medium text-navy-900">
                  {user?.createdAt ? formatDate(user.createdAt) : 'Not available'}
                </p>
              </div>
            </div>

            {/* Display name - editable */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Display Name</p>
                  {editName ? (
                    <form onSubmit={handleSaveName} className="mt-2 flex gap-2">
                      <Input
                        label=""
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        error={nameError}
                        className="py-2"
                        aria-label="Display name"
                      />
                      <Button type="submit" variant="secondary" size="sm" loading={savingName} className="flex-shrink-0 mt-0">
                        <Save className="h-4 w-4" /> Save
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditName(false); setNameError(null); }}
                        className="flex-shrink-0"
                      >
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-sm font-medium text-navy-900">{user?.fullName || 'Not set'}</p>
                      <button
                        onClick={() => { setEditName(true); setNameValue(user?.fullName ?? ''); }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {nameSuccess && (
            <AlertMessage type="success" className="mt-4">
              Your display name has been updated.
            </AlertMessage>
          )}
        </div>

        {/* Security note */}
        <div className="card-base p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-navy-900 mb-1">Account Security</h3>
              <p className="text-sm text-navy-500">
                Your account is secured with a hashed password. Password changes are
                not available in the current version.
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-navy-900 mb-0.5">Sign Out</h3>
              <p className="text-sm text-navy-500">Log out of your TruthLens account.</p>
            </div>
            <Button variant="danger" size="md" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
