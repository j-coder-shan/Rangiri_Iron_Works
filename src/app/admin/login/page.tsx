// src/app/admin/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const { user, login, isMock } = useAuth();
  const router = useRouter();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (user) {
      router.replace('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showErrorToast('Please fill in all credentials');
      return;
    }

    setLoading(true);

    try {
      const success = await login(email.trim(), password.trim());
      if (success) {
        showSuccessToast('Logged in successfully!');
        router.replace('/admin');
      }
    } catch (err: any) {
      console.error(err);
      showErrorToast(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-iron bg-mesh py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-spark/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center gap-4">
          <Logo height={48} variant="light" />
          <div className="text-center">
            <span className="text-xs font-bold text-spark tracking-widest uppercase font-display block mb-1">
              {isMock ? 'MOCK SYSTEM DATABASE' : 'PRODUCTION SYSTEM DATABASE'}
            </span>
            <h2 className="text-sm font-semibold text-steel-light uppercase">
              Management Portal
            </h2>
          </div>
        </div>

        {/* Card Shell containing credentials fields */}
        <Card variant="glass" className="p-8 border-iron-light/40 shadow-2xl relative">
          <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Email input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-steel-light">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rangiri.lk"
                  className="w-full bg-iron text-smoke text-sm pl-11 pr-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20 font-mono"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-steel-light">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-iron text-smoke text-sm pl-11 pr-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20 font-mono"
                />
              </div>
            </div>

            {/* Mock notice details */}
            {isMock && (
              <div className="bg-spark-glow border border-spark/20 p-4 rounded-md text-[11px] leading-relaxed text-steel-light">
                <span className="font-bold text-smoke block uppercase tracking-wide mb-1">
                  💡 Mock Panel Access
                </span>
                Use the following credentials:
                <div className="font-mono mt-1 text-spark-light">
                  Email: <span className="text-smoke">admin@rangiri.lk</span><br/>
                  Pass: <span className="text-smoke">admin123</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="spark"
              size="lg"
              loading={loading}
              className="w-full font-bold uppercase tracking-widest text-xs py-3.5 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>Login Portal</span>
            </Button>

          </form>
        </Card>
      </div>

    </div>
  );
}
