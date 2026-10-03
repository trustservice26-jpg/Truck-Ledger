import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DailyRecord, Profile, RecordTotals } from '../types';
import { formatCurrency, formatDisplayDate } from './formatters';

export interface PDFExportOptions {
  profile: Profile;
  records: DailyRecord[];
  totals: RecordTotals;
  from: string;
  to: string;
}

export function downloadLedgerPDF({
  profile,
  records,
  totals,
  from,
  to,
}: PDFExportOptions): boolean {
  try {
    // Official Standard A4 Portrait Layout matching exact screen preview
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const currentDate = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const statementDocId = `FL-${profile.vehicle_number || 'VEH'}-${from.replace(/-/g, '')}-${to.replace(/-/g, '')}`;

    // 1. Top Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 26, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('FLEETLEDGER', 12, 10);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(48, 6.5, 30, 5, 1, 1, 'F');
    doc.setTextColor(226, 232, 240);
    doc.text('AUDIT STATEMENT', 50, 10);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('VEHICLE INCOME & OPERATING COST LEDGER', 12, 17);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text('Official Fleet Audit & Driver Settlement Statement', 12, 22);

    // Header Right Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(226, 232, 240);
    doc.text(`Doc Ref: ${statementDocId}`, pageWidth - 12, 9, { align: 'right' });
    doc.text(`Generated: ${currentDate}`, pageWidth - 12, 15, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`Period: ${formatDisplayDate(from)} to ${formatDisplayDate(to)}`, pageWidth - 12, 21, { align: 'right' });

    // 2. Vehicle & Driver Credentials Box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.roundedRect(12, 30, pageWidth - 24, 15, 1.5, 1.5, 'FD');

    const colW = (pageWidth - 24) / 4;

    // Col 1: Vehicle Number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('VEHICLE NUMBER:', 15, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(profile.vehicle_number || 'N/A', 15, 41);

    // Col 2: Driver Name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('DRIVER NAME:', 15 + colW, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(profile.name || 'N/A', 15 + colW, 41);

    // Col 3: Contact Phone
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('CONTACT PHONE:', 15 + colW * 2, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(profile.phone || 'N/A', 15 + colW * 2, 41);

    // Col 4: Account Role
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('ACCOUNT ROLE:', 15 + colW * 3, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text((profile.role || 'USER').toUpperCase(), 15 + colW * 3, 41);

    // 3. Financial Summary Cards (4 Cards)
    const cardY = 48;
    const cardW = (pageWidth - 24 - 9) / 4;
    const cardH = 16;

    // Card 1: Gross Income
    doc.setFillColor(240, 253, 244); // emerald-50
    doc.setDrawColor(187, 247, 208); // emerald-200
    doc.roundedRect(12, cardY, cardW, cardH, 1.5, 1.5, 'FD');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.text('GROSS INCOME', 15, cardY + 5);
    doc.setFontSize(11);
    doc.setTextColor(6, 78, 59);
    doc.text(formatCurrency(totals.income), 15, cardY + 11);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(5, 150, 105);
    doc.text('Total Revenue Logged', 15, cardY + 14.5);

    // Card 2: Fuel & Direct Costs
    doc.setFillColor(254, 243, 199); // amber-50
    doc.setDrawColor(253, 230, 138); // amber-200
    doc.roundedRect(12 + cardW + 3, cardY, cardW, cardH, 1.5, 1.5, 'FD');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('FUEL & DIRECT COSTS', 15 + cardW + 3, cardY + 5);
    doc.setFontSize(11);
    doc.setTextColor(120, 53, 15);
    doc.text(formatCurrency(totals.cost), 15 + cardW + 3, cardY + 11);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 83, 9);
    doc.text('Fuel & Engine Ops', 15 + cardW + 3, cardY + 14.5);

    // Card 3: Other Expenses
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(12 + (cardW + 3) * 2, cardY, cardW, cardH, 1.5, 1.5, 'FD');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text('OTHER EXPENSES', 15 + (cardW + 3) * 2, cardY + 5);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(formatCurrency(totals.other), 15 + (cardW + 3) * 2, cardY + 11);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Tolls & Incidentals', 15 + (cardW + 3) * 2, cardY + 14.5);

    // Card 4: Net Settlement Balance
    const isPositive = totals.balance >= 0;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(15, 23, 42); // slate-900 border
    doc.roundedRect(12 + (cardW + 3) * 3, cardY, cardW, cardH, 1.5, 1.5, 'FD');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('NET SETTLEMENT', 15 + (cardW + 3) * 3, cardY + 5);
    doc.setFontSize(11);
    if (isPositive) {
      doc.setTextColor(4, 120, 87);
    } else {
      doc.setTextColor(190, 18, 60);
    }
    doc.text(formatCurrency(totals.balance), 15 + (cardW + 3) * 3, cardY + 11);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(isPositive ? 'Net Surplus Balance' : 'Operating Deficit', 15 + (cardW + 3) * 3, cardY + 14.5);

    // 4. Itemized Ledger Table
    const tableHeaders = [
      'Date',
      'Income',
      'Cost',
      'Cost Details',
      'Other',
      'Net Balance',
    ];

    const tableRows = records.map(r => {
      const inc = Number(r.income) || 0;
      const cst = Number(r.cost) || 0;
      const oth = Number(r.other) || 0;
      const net = inc - cst - oth;
      return [
        formatDisplayDate(r.record_date),
        formatCurrency(inc),
        formatCurrency(cst),
        r.cost_details || '—',
        formatCurrency(oth),
        formatCurrency(net),
      ];
    });

    const footRows = [
      [
        'TOTALS',
        formatCurrency(totals.income),
        formatCurrency(totals.cost),
        '—',
        formatCurrency(totals.other),
        formatCurrency(totals.balance),
      ],
    ];

    autoTable(doc, {
      startY: 68,
      margin: { left: 12, right: 12 },
      head: [tableHeaders],
      body:
        tableRows.length > 0
          ? tableRows
          : [['No records found for this period', '', '', '', '', '']],
      foot: footRows,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: [15, 23, 42],
        valign: 'middle',
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        fontSize: 8,
      },
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        fontSize: 8.5,
      },
      columnStyles: {
        0: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
        2: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
        3: { cellWidth: 50, halign: 'left' },
        4: { cellWidth: 26, halign: 'right' },
        5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didDrawPage: data => {
        // Page footer
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(
          `FleetLedger Enterprise · Official Settlement Document — Page ${data.pageNumber}`,
          12,
          pageHeight - 6
        );
        doc.text(
          `Vehicle: ${profile.vehicle_number} | Driver: ${profile.name}`,
          pageWidth - 12,
          pageHeight - 6,
          { align: 'right' }
        );
      },
    });

    // 5. Direct file download
    const cleanVehicle = (profile.vehicle_number || 'vehicle').replace(
      /[^a-zA-Z0-9_-]/g,
      '_'
    );
    const filename = `FleetLedger_${cleanVehicle}_${from}_to_${to}.pdf`;
    doc.save(filename);

    return true;
  } catch (err) {
    console.error('Failed to generate PDF with jsPDF:', err);
    try {
      window.print();
    } catch {}
    return false;
  }
}
