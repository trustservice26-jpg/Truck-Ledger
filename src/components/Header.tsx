import React from 'react';
import { LogOut, Shield, FileText, BookOpen, BarChart3, Truck } from 'lucide-react';
import { Profile } from '../types';

export type AppTab = 'ledger' | 'overview' | 'pdf' | 'admin';

interface HeaderProps {
  profile: Profile;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogout: () => void;
  onOpenDatabaseModal?: () => void;
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 no-print shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand & Vehicle Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('ledger')}
              className="text-left font-extrabold text-base sm:text-xl tracking-tight text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="hidden xs:inline">FleetLedger</span>
            </button>
            <span className="text-[11px] font-mono-tabular px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-bold truncate max-w-[110px] sm:max-w-none">
              {profile.vehicle_number}
            </span>
          </div>

          {/* Menu Bar: Daily Financial Records | Monthly Overview | Generate PDF | Fleet Admin */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {/* 1. Daily Financial Records */}
            <button
              onClick={() => setActiveTab('ledger')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'ledger'
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Daily Financial Records page"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Daily Financial Records</span>
              <span className="sm:hidden">Daily Records</span>
            </button>

            {/* 2. Monthly Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Monthly Income vs Expenses Overview & Bar Chart"
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Monthly Overview</span>
              <span className="sm:hidden">Overview</span>
            </button>

            {/* 3. Generate PDF */}
            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'pdf'
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Generate, Preview and Download PDF Statements"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Generate PDF</span>
              <span className="sm:hidden">PDF Statement</span>
            </button>

            {/* 4. Fleet Admin (Admin Role only) */}
            {profile.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Fleet Master Directory"
              >
                <Shield className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="hidden sm:inline">Fleet Admin</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}
          </nav>

          {/* User info & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                {profile.name}
              </span>
              <span className="text-[10px] text-slate-500">
                {profile.role === 'admin' ? 'Administrator' : 'Driver'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              title="Logout from session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
