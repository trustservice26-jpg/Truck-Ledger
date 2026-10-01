import React from 'react';
import { RecordTotals } from '../types';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Fuel, ShieldAlert } from 'lucide-react';

interface StatsCardsProps {
  totals: RecordTotals;
  currency?: string;
  subtext?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ totals, currency = '$', subtext }) => {
  const isPositive = totals.balance >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 my-3 sm:my-6">
      {/* Gross Income Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4.5 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Gross Income</span>
          <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-1.5 sm:mt-2">
          <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 font-mono-tabular block truncate">
            {formatCurrency(totals.income, currency)}
          </span>
        </div>
        <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 truncate">
          <span>{totals.entryCount} recorded days</span>
        </div>
      </div>

      {/* Running Cost Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4.5 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Fuel &amp; Costs</span>
          <div className="p-1 sm:p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
            <Fuel className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-1.5 sm:mt-2">
          <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 font-mono-tabular block truncate">
            {formatCurrency(totals.cost, currency)}
          </span>
        </div>
        <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 truncate">
          <span>{totals.income > 0 ? `${((totals.cost / totals.income) * 100).toFixed(1)}% of income` : 'Direct vehicle ops'}</span>
        </div>
      </div>

      {/* Other / Maintenance Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4.5 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Incidentals</span>
          <div className="p-1 sm:p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-1.5 sm:mt-2">
          <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 font-mono-tabular block truncate">
            {formatCurrency(totals.other, currency)}
          </span>
        </div>
        <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 truncate">
          <span>Tolls, repairs &amp; permits</span>
        </div>
      </div>

      {/* Net Balance / Take-Home Card */}
      <div className={`border rounded-xl p-3 sm:p-4.5 transition-shadow hover:shadow-xs ${
        isPositive ? 'bg-white border-emerald-300' : 'bg-rose-50/50 border-rose-300'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Net Balance</span>
          <div className={`p-1 sm:p-1.5 rounded-lg shrink-0 ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {isPositive ? <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </div>
        </div>
        <div className="mt-1.5 sm:mt-2">
          <span className={`text-base sm:text-2xl font-black tracking-tight font-mono-tabular block truncate ${
            isPositive ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {formatCurrency(totals.balance, currency)}
          </span>
        </div>
        <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 flex items-center justify-between truncate">
          <span>Margin: <strong className="font-mono-tabular">{totals.marginPercent.toFixed(1)}%</strong></span>
          {subtext && <span className="text-slate-400 hidden xs:inline">· {subtext}</span>}
        </div>
      </div>
    </div>
  );
};
