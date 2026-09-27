import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  History,
  BarChart3,
  LogOut,
  Recycle,
  Menu,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, logout, username } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pickup Requests', path: '/admin/requests', icon: ClipboardList },
    { name: 'History', path: '/admin/history', icon: History },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5EAE6] sticky top-0 z-30">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold">
            <Recycle size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#17211B]">
            EcoCollect <span className="text-xs font-normal text-[#16A34A] px-1.5 py-0.5 bg-[#DCFCE7] rounded">Admin</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-[#17211B] hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-white border-r border-[#E5EAE6] flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen z-20`}
      >
        <div className="p-5">
          {/* Logo / Title */}
          <div className="hidden md:flex items-center gap-2.5 pb-6 border-b border-[#E5EAE6]">
            <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold">
              <Recycle size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="font-bold text-base text-[#17211B] tracking-tight">
                EcoCollect
              </div>
              <div className="text-[11px] font-medium text-[#16A34A] flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>Staff Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#14532D] text-white shadow-2xs font-semibold'
                      : 'text-[#6B756E] hover:text-[#17211B] hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-[#6B756E]'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E5EAE6] space-y-2">
          <div className="px-3 py-2 bg-[#F7FAF8] rounded-xl border border-[#E5EAE6] text-xs">
            <span className="text-[#6B756E] block text-[10px] uppercase font-semibold">Logged in as</span>
            <span className="font-semibold text-[#17211B] truncate block">{username || 'admin'}</span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#6B756E] hover:text-[#17211B] hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={14} />
            <span>Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
