import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Truck, ShieldCheck, KeyRound, UserPlus, LogIn, Sparkles, Check } from 'lucide-react';
import bannerImage from '../assets/images/fleet_ledger_banner_1790516387387.jpg';

interface AuthViewProps {
  onOpenDatabaseModal?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const email = `${vehicleNumber.trim().toLowerCase()}@vehicle.local`;

    try {
      if (isRegister) {
        if (!name.trim()) {
          setMessage({ text: 'Please enter driver or owner name.', type: 'error' });
          setLoading(false);
          return;
        }
        if (!vehicleNumber.trim()) {
          setMessage({ text: 'Please enter vehicle registration number.', type: 'error' });
          setLoading(false);
          return;
        }
        if (!password || password.length < 4) {
          setMessage({ text: 'Password must be at least 4 characters.', type: 'error' });
          setLoading(false);
          return;
        }

        const res = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              vehicle_number: vehicleNumber.trim().toUpperCase(),
              name: name.trim(),
              phone: phone.trim(),
            },
          },
        });

        if (res.error) {
          setMessage({ text: res.error.message, type: 'error' });
        } else {
          setMessage({
            text: 'Account created successfully! Logging you in...',
            type: 'success',
          });
        }
      } else {
        if (!vehicleNumber.trim()) {
          setMessage({ text: 'Please enter your vehicle number.', type: 'error' });
          setLoading(false);
          return;
        }

        const res = await supabase.auth.signInWithPassword({
          email,
          password: password || 'password',
        });

        if (res.error) {
          setMessage({ text: res.error.message, type: 'error' });
        }
      }
    } catch (err: any) {
      setMessage({ text: err?.message || 'Authentication error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (vNum: string, pass: string = 'password') => {
    setLoading(true);
    setMessage(null);
    setVehicleNumber(vNum);
    setPassword(pass);

    const email = `${vNum.toLowerCase()}@vehicle.local`;
    const res = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (res.error) {
      setMessage({ text: res.error.message, type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Banner & Header info */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          FleetLedger
        </h1>
        <p className="mt-1.5 text-xs text-slate-600">
          Commercial Vehicle Daily Income & Cost Management System
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-200 sm:rounded-2xl sm:px-10 overflow-hidden">
          {/* Hero Fleet Visual Header */}
          <div className="relative -mx-4 -mt-8 sm:-mx-10 mb-6 h-36 overflow-hidden bg-slate-900">
            <img
              src={bannerImage}
              alt="Commercial vehicle fleet operations"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end p-5">
              <div className="text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                  Daily Transport Ledger
                </span>
                <h2 className="text-base font-bold text-white">
                  Driver Earnings & Expense Ledger
                </h2>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setMessage(null);
              }}
              className={`flex-1 pb-3 text-xs font-semibold text-center border-b-2 transition-colors ${
                !isRegister
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In to Vehicle
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setMessage(null);
              }}
              className={`flex-1 pb-3 text-xs font-semibold text-center border-b-2 transition-colors ${
                isRegister
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Register New Vehicle
            </button>
          </div>

          {/* Main Form */}
          <form className="space-y-4" onSubmit={handleAuth}>
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driver / Owner Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Chen"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono-tabular transition-colors"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Registration Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KA-01-AB-1234 or ADM-001"
                value={vehicleNumber}
                onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono-tabular uppercase font-semibold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  message.type === 'error'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading
                  ? 'Processing...'
                  : isRegister
                  ? 'Register Vehicle Account'
                  : 'Access Driver Ledger'}
              </button>
            </div>
          </form>

          {/* Quick Demo Logins strip */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              Instant 1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('KA-01-AB-1234', 'password123')}
                className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors group"
              >
                <div className="font-bold text-slate-800 group-hover:text-blue-700 font-mono-tabular text-[11px]">
                  KA-01-AB-1234
                </div>
                <div className="text-[10px] text-slate-500">Driver (Marcus Chen)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADM-001', 'password123')}
                className="p-2 text-left bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg transition-colors group"
              >
                <div className="font-bold text-amber-900 group-hover:text-amber-800 font-mono-tabular text-[11px] flex items-center gap-1">
                  <span>ADM-001</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded">Admin</span>
                </div>
                <div className="text-[10px] text-slate-500">Fleet Director (Alex)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
