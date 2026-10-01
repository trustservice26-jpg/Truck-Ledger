import React from 'react';
import { DailyRecord, Profile, RecordTotals } from '../types';
import { formatCurrency, formatDisplayDate } from '../utils/formatters';

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

  return (
    <div
      className={
        screenPreview
          ? 'bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs text-slate-900 font-sans'
          : 'print-only print-container p-6 bg-white text-black font-sans'
      }
    >
      {/* Official Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black uppercase">
            Vehicle Income & Operating Cost Ledger
          </h1>
          <p className="text-sm text-gray-700 mt-1">Official Fleet Audit & Driver Settlement Statement</p>
        </div>
        <div className="text-right text-xs text-gray-700">
          <div><span className="font-semibold text-gray-500">Generated:</span> <span className="font-bold text-black">{currentDate}</span></div>
          <div className="mt-1"><span className="font-semibold text-gray-500">Period:</span> <span className="font-bold text-black text-sm">{formatDisplayDate(from)} to {formatDisplayDate(to)}</span></div>
        </div>
      </div>

      {/* Vehicle and Driver Credentials */}
      <div className="grid grid-cols-4 gap-4 p-4 border border-gray-300 bg-gray-50 mb-6 text-xs">
        <div>
          <span className="text-gray-500 block">Vehicle Number:</span>
          <span className="font-bold text-sm text-black font-mono-tabular">{profile.vehicle_number}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Driver Name:</span>
          <span className="font-bold text-sm text-black">{profile.name}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Contact Phone:</span>
          <span className="font-medium text-black">{profile.phone || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Account Role:</span>
          <span className="font-medium text-black uppercase">{profile.role}</span>
        </div>
      </div>

      {/* Financial Executive Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6 text-center">
        <div className="border border-gray-300 p-3 bg-gray-50">
          <span className="text-[11px] text-gray-600 uppercase font-semibold block">Gross Income</span>
          <span className="text-lg font-bold font-mono-tabular text-black">{formatCurrency(totals.income)}</span>
        </div>
        <div className="border border-gray-300 p-3 bg-gray-50">
          <span className="text-[11px] text-gray-600 uppercase font-semibold block">Fuel & Direct Costs</span>
          <span className="text-lg font-bold font-mono-tabular text-black">{formatCurrency(totals.cost)}</span>
        </div>
        <div className="border border-gray-300 p-3 bg-gray-50">
          <span className="text-[11px] text-gray-600 uppercase font-semibold block">Other Expenses</span>
          <span className="text-lg font-bold font-mono-tabular text-black">{formatCurrency(totals.other)}</span>
        </div>
        <div className="border-2 border-black p-3 bg-gray-100">
          <span className="text-[11px] text-black uppercase font-bold block">Net Settlement Balance</span>
          <span className="text-lg font-bold font-mono-tabular text-black">{formatCurrency(totals.balance)}</span>
        </div>
      </div>

      {/* Itemized Table */}
      <table className="w-full text-left border-collapse text-xs mb-8">
        <thead>
          <tr className="bg-gray-100 border-b border-t border-gray-400 font-semibold text-black">
            <th className="py-2.5 px-3 border border-gray-300">Date</th>
            <th className="py-2.5 px-3 text-right border border-gray-300">Income</th>
            <th className="py-2.5 px-3 text-right border border-gray-300">Cost</th>
            <th className="py-2.5 px-3 border border-gray-300">Cost Details</th>
            <th className="py-2.5 px-3 text-right border border-gray-300">Other</th>
            <th className="py-2.5 px-3 text-right border border-gray-300">Net Balance</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => {
            const bal = (Number(r.income) || 0) - (Number(r.cost) || 0) - (Number(r.other) || 0);
            return (
              <tr key={r.id} className="border-b border-gray-200">
                <td className="py-2.5 px-3 border border-gray-300 font-mono-tabular font-bold text-slate-900 text-center whitespace-nowrap">
                  {formatDisplayDate(r.record_date)}
                </td>
                <td className="py-2 px-3 text-right border border-gray-300 font-mono-tabular font-semibold">{formatCurrency(r.income)}</td>
                <td className="py-2 px-3 text-right border border-gray-300 font-mono-tabular font-semibold">{formatCurrency(r.cost)}</td>
                <td className="py-2 px-3 border border-gray-300 text-slate-700">{r.cost_details || '—'}</td>
                <td className="py-2 px-3 text-right border border-gray-300 font-mono-tabular">{formatCurrency(r.other)}</td>
                <td className="py-2 px-3 text-right border border-gray-300 font-mono-tabular font-bold">{formatCurrency(bal)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold border-t-2 border-black">
            <td className="py-2.5 px-3 border border-gray-300">TOTALS</td>
            <td className="py-2.5 px-3 text-right border border-gray-300 font-mono-tabular">{formatCurrency(totals.income)}</td>
            <td className="py-2.5 px-3 text-right border border-gray-300 font-mono-tabular">{formatCurrency(totals.cost)}</td>
            <td className="py-2.5 px-3 border border-gray-300 text-center">—</td>
            <td className="py-2.5 px-3 text-right border border-gray-300 font-mono-tabular">{formatCurrency(totals.other)}</td>
            <td className="py-2.5 px-3 text-right border border-gray-300 font-mono-tabular">{formatCurrency(totals.balance)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Signature & Settlement Section */}
      <div className="mt-16 grid grid-cols-2 gap-16 pt-8 border-t border-gray-300 text-xs">
        <div>
          <div className="border-b border-black pb-1 mb-2 font-semibold">Driver Signature:</div>
          <p className="text-gray-500">I certify that the above odometer trips and expenses are true and accurate.</p>
        </div>
        <div>
          <div className="border-b border-black pb-1 mb-2 font-semibold">Fleet Supervisor / Auditor:</div>
          <p className="text-gray-500">Verified against fuel receipts and fleet management ledger entries.</p>
        </div>
      </div>
    </div>
  );
};
