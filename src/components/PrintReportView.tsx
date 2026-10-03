import React from 'react';
import { DailyRecord, Profile, RecordTotals } from '../types';
import { formatCurrency, formatDisplayDate } from '../utils/formatters';
import { Truck, FileText } from 'lucide-react';

interface PrintReportViewProps {
  profile: Profile;
  records: DailyRecord[];
  totals: RecordTotals;
  from: string;
  to: string;
  screenPreview?: boolean;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  profile,
  records,
  totals,
  from,
  to,
  screenPreview = false,
}) => {
  const currentDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const statementDocId = `FL-${profile.vehicle_number || 'VEH'}-${from.replace(/-/g, '')}-${to.replace(/-/g, '')}`;

  return (
    <div
      className={
        screenPreview
          ? 'bg-white border border-slate-300 rounded-xl sm:rounded-sm p-3.5 sm:p-8 md:p-10 shadow-xl sm:shadow-2xl text-slate-900 font-sans max-w-[210mm] mx-auto transition-all'
          : 'print-only print-container p-4 sm:p-6 bg-white text-black font-sans w-full max-w-[210mm] mx-auto'
      }
      style={{
        minHeight: screenPreview ? '270mm' : 'auto',
      }}
    >
      {/* Top Document Header Bar / Dialogue Box */}
      <div className="border-b-2 border-slate-900 pb-2.5 sm:pb-4 mb-3 sm:mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
          {/* Brand & Main Title */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs print:bg-black">
              <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-slate-800">
                  FleetLedger
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 bg-blue-100 text-blue-900 rounded border border-blue-300 tracking-wide uppercase inline-flex items-center gap-1 shadow-2xs">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-600"></span>
                  AUDIT STATEMENT
                </span>
              </div>
              <h1 className="text-xs sm:text-base md:text-xl font-black tracking-tight text-slate-950 uppercase mt-0.5 leading-snug break-words">
                Vehicle Income &amp; Operating Cost Ledger
              </h1>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5">
                Official Fleet Audit &amp; Driver Settlement Statement
              </p>
            </div>
          </div>

          {/* Right/Bottom Metadata Dialogue Box for Mobile & Desktop */}
          <div className="grid grid-cols-2 sm:flex sm:flex-col sm:text-right gap-1 p-1.5 sm:p-0 bg-slate-50 sm:bg-transparent rounded-md border border-slate-200 sm:border-0 text-[10px] sm:text-xs shrink-0">
            <div>
              <span className="text-slate-500 font-medium">Doc Ref:</span>{' '}
              <span className="font-mono-tabular font-bold text-slate-900">{statementDocId}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Generated:</span>{' '}
              <span className="font-bold text-slate-900 whitespace-nowrap">{currentDate}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 pt-0.5 sm:pt-0 border-t border-slate-200 sm:border-0">
              <span className="text-slate-500 font-medium">Period:</span>{' '}
              <span className="font-bold text-slate-950 font-mono-tabular whitespace-nowrap">
                {formatDisplayDate(from)} to {formatDisplayDate(to)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle and Driver Credentials Box */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-3.5 border border-slate-300 bg-slate-50/80 mb-4 sm:mb-5 text-xs rounded-lg">
        <div className="sm:border-r border-slate-200 sm:pr-2">
          <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold block tracking-wider">
            Vehicle Number:
          </span>
          <span className="font-black text-xs sm:text-sm text-slate-950 font-mono-tabular mt-0.5 block truncate">
            {profile.vehicle_number || 'N/A'}
          </span>
        </div>
        <div className="sm:border-r border-slate-200 sm:pr-2">
          <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold block tracking-wider">
            Driver Name:
          </span>
          <span className="font-bold text-xs sm:text-sm text-slate-950 mt-0.5 block truncate">
            {profile.name || 'N/A'}
          </span>
        </div>
        <div className="sm:border-r border-slate-200 sm:pr-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
          <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold block tracking-wider">
            Contact Phone:
          </span>
          <span className="font-medium text-xs text-slate-900 font-mono-tabular mt-0.5 block truncate">
            {profile.phone || 'N/A'}
          </span>
        </div>
        <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
          <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold block tracking-wider">
            Account Role:
          </span>
          <span className="inline-block mt-0.5 font-bold text-[10px] sm:text-xs uppercase px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
            {profile.role || 'USER'}
          </span>
        </div>
      </div>

      {/* Financial Executive Summary Cards (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5 text-center">
        <div className="border border-slate-300 p-2 sm:p-2.5 bg-emerald-50/50 rounded-lg">
          <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block">
            Gross Income
          </span>
          <span className="text-sm sm:text-base md:text-lg font-black font-mono-tabular text-emerald-950 mt-0.5 block truncate">
            {formatCurrency(totals.income)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-emerald-700/80 block mt-0.5 truncate">
            Total Revenue Logged
          </span>
        </div>

        <div className="border border-slate-300 p-2 sm:p-2.5 bg-amber-50/50 rounded-lg">
          <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider block">
            Fuel &amp; Direct Costs
          </span>
          <span className="text-sm sm:text-base md:text-lg font-black font-mono-tabular text-amber-950 mt-0.5 block truncate">
            {formatCurrency(totals.cost)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-amber-700/80 block mt-0.5 truncate">
            Fuel &amp; Engine Ops
          </span>
        </div>

        <div className="border border-slate-300 p-2 sm:p-2.5 bg-slate-50 rounded-lg">
          <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider block">
            Other Expenses
          </span>
          <span className="text-sm sm:text-base md:text-lg font-black font-mono-tabular text-slate-900 mt-0.5 block truncate">
            {formatCurrency(totals.other)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5 truncate">
            Tolls &amp; Incidentals
          </span>
        </div>

        <div className="border-2 border-slate-900 p-2 sm:p-2.5 bg-slate-100 rounded-lg">
          <span className="text-[10px] text-slate-900 uppercase font-black tracking-wider block">
            Net Settlement Balance
          </span>
          <span
            className={`text-sm sm:text-base md:text-lg font-black font-mono-tabular mt-0.5 block truncate ${
              totals.balance >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatCurrency(totals.balance)}
          </span>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-600 block mt-0.5 truncate">
            {totals.balance >= 0 ? 'Net Surplus Balance' : 'Operating Deficit'}
          </span>
        </div>
      </div>

      {/* Itemized Ledger Table with Horizontal Scroll Support on Mobile */}
      <div className="border border-slate-300 rounded-lg overflow-x-auto mb-5 sm:mb-6 shadow-2xs">
        <table className="w-full min-w-[540px] sm:min-w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3 border-r border-slate-300 w-28 text-center">Date</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-right w-24">Income</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-right w-24">Cost</th>
              <th className="py-2.5 px-3 border-r border-slate-300">Cost Details</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-right w-24">Other</th>
              <th className="py-2.5 px-3 text-right w-28">Net Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.length > 0 ? (
              records.map((r, idx) => {
                const bal =
                  (Number(r.income) || 0) - (Number(r.cost) || 0) - (Number(r.other) || 0);
                return (
                  <tr
                    key={r.id || idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                  >
                    <td className="py-2 px-3 border-r border-slate-200 font-mono-tabular font-bold text-slate-950 text-center whitespace-nowrap">
                      {formatDisplayDate(r.record_date)}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-mono-tabular font-semibold text-emerald-900">
                      {formatCurrency(r.income)}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-mono-tabular font-semibold text-slate-900">
                      {formatCurrency(r.cost)}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-700 text-xs">
                      {r.cost_details ? (
                        <span>{r.cost_details}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-right font-mono-tabular text-slate-700">
                      {formatCurrency(r.other)}
                    </td>
                    <td
                      className={`py-2 px-3 text-right font-mono-tabular font-bold ${
                        bal >= 0 ? 'text-slate-900' : 'text-rose-700'
                      }`}
                    >
                      {formatCurrency(bal)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 bg-white">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <FileText className="w-6 h-6 text-slate-400" />
                    <span className="font-semibold text-xs text-slate-700">
                      No transactions recorded for this period
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDisplayDate(from)} to {formatDisplayDate(to)}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-900 text-slate-950">
              <td className="py-2.5 px-3 border-r border-slate-300 text-center font-black">TOTALS</td>
              <td className="py-2.5 px-3 border-r border-slate-300 text-right font-mono-tabular font-black text-emerald-950">
                {formatCurrency(totals.income)}
              </td>
              <td className="py-2.5 px-3 border-r border-slate-300 text-right font-mono-tabular font-black">
                {formatCurrency(totals.cost)}
              </td>
              <td className="py-2.5 px-3 border-r border-slate-300 text-center text-slate-400">—</td>
              <td className="py-2.5 px-3 border-r border-slate-300 text-right font-mono-tabular font-black">
                {formatCurrency(totals.other)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono-tabular font-black text-slate-950 border-b-2 border-slate-900">
                {formatCurrency(totals.balance)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Official Footnote & Archival Watermark */}
      <div className="mt-6 sm:mt-8 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-1 text-center sm:text-left">
        <span>FleetLedger Enterprise Transport Management · Official Settlement Document</span>
        <span>A4 Layout · Certified Tamper-Evident Record · Page 1 of 1</span>
      </div>
    </div>
  );
};
