import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Recycle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAdminAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Waste Guide', path: '/waste-guide' },
    { name: 'My Requests', path: '/my-requests' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E5EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 focus:outline-none">
            <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold">
              <Recycle size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#17211B]">
              Eco<span className="text-[#16A34A]">Collect</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#16A34A] font-semibold'
                    : 'text-[#6B756E] hover:text-[#17211B]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action CTA & Admin link */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B756E] hover:text-[#17211B] rounded-lg hover:bg-gray-100 transition-colors"
              title="Staff Administration Portal"
            >
              <ShieldCheck size={14} className={isAuthenticated ? "text-[#16A34A]" : "text-[#6B756E]"} />
              <span>{isAuthenticated ? 'Staff Dashboard' : 'Staff Login'}</span>
            </Link>

            <Link
              to="/request"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs"
            >
              <span>Request a Pickup</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#17211B] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden border-b border-[#E5EAE6] bg-[#FFFFFF] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-[#DCFCE7]/60 text-[#14532D] font-semibold'
                    : 'text-[#17211B] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#E5EAE6] flex flex-col gap-2.5">
            <Link
              to="/request"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors"
            >
              <span>Request a Pickup</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#6B756E] hover:bg-gray-50"
            >
              <ShieldCheck size={14} className={isAuthenticated ? "text-[#16A34A]" : "text-[#6B756E]"} />
              <span>{isAuthenticated ? 'Go to Staff Dashboard' : 'Staff Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
