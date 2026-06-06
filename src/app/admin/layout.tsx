// src/app/admin/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  LayoutDashboard, FolderOpen, Tags, Inbox, 
  MessageSquare, Image as ImageIcon, BookOpen, 
  Settings as SettingsIcon, LogOut, User 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isMock } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4F2] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E8500A]"></div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Loading Admin...</span>
      </div>
    );
  }

  // If we are on the login page, just render the child login form directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Guard routing redirect
  if (!user) {
    return null;
  }

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { href: '/admin/items', label: 'Service Items', icon: Tags },
    { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    { href: '/admin/gallery', label: 'Gallery Manager', icon: ImageIcon },
    { href: '/admin/blog', label: 'Blog Posts', icon: BookOpen },
    { href: '/admin/settings', label: 'Site Settings', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F4F2] text-[#1A1A1A] font-body">
      
      {/* Sidebar (Admin Shell Left Column) */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col justify-between flex-shrink-0 shadow-2xl relative z-20">
        <div className="p-6 border-b border-[#2D2D2D] space-y-2">
          <Logo height={32} variant="light" />
          <span className="text-[9px] font-bold text-amber-500 font-mono tracking-widest block uppercase">
            {isMock ? 'MOCK DEV PANEL' : 'ADMIN CONTROL PANEL'}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                  active 
                    ? 'bg-[#E8500A] text-white shadow-lg shadow-[#E8500A]/10' 
                    : 'text-gray-400 hover:bg-[#2D2D2D] hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer profile & logout */}
        <div className="p-4 border-t border-[#2D2D2D] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-[#2D2D2D] rounded-full text-gray-300">
              <User size={16} />
            </div>
            <div className="text-xs truncate">
              <span className="font-semibold block truncate">{user.email || 'Admin User'}</span>
              <span className="text-gray-500 text-[10px] uppercase block">Super Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold bg-[#2D2D2D] text-red-400 hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content area (Right side) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Topbar header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-display font-bold text-[#1A1A1A] uppercase tracking-wider">
            {menuItems.find((item) => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))?.label || 'Admin Portal'}
          </h2>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <main className="flex-grow p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
