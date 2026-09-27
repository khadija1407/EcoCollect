import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, User, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('ecocollect2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username.trim(), password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid admin username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F7FAF8]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5EAE6] p-8 shadow-xs">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#16A34A] mx-auto flex items-center justify-center font-bold">
            <ShieldCheck size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#17211B]">Staff Portal</h1>
          <p className="mt-1 text-sm text-[#6B756E]">
            Sign in to manage waste collection dispatch and requests
          </p>
        </div>

        {error && (
          <div className="mt-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#17211B] uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter staff username"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#E5EAE6] text-[#17211B] focus:border-[#16A34A] focus:outline-none"
              />
              <User size={16} className="absolute left-3 top-2.5 text-[#6B756E]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17211B] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter staff password"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#E5EAE6] text-[#17211B] focus:border-[#16A34A] focus:outline-none"
              />
              <Lock size={16} className="absolute left-3 top-2.5 text-[#6B756E]" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E5EAE6] text-center">
          <p className="text-xs text-[#6B756E]">
            Demo credentials pre-filled: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">admin</code> / <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">ecocollect2026</code>
          </p>
          <Link to="/" className="inline-block mt-3 text-xs text-[#16A34A] hover:underline font-medium">
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
