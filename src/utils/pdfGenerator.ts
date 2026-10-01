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
    // Landscape A4 provides ideal width for financial ledger columns
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // 1. Header Banner & Title
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 24, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('FLEETLEDGER', 14, 11);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text('Commercial Vehicle Income & Operating Expense Ledger Statement', 14, 18);

    // Header Right: Date details in bold, clear font for high visibility and understanding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`Generated: ${currentDate}`, pageWidth - 14, 11, { align: 'right' });
    doc.text(`Period: ${formatDisplayDate(from)} to ${formatDisplayDate(to)}`, pageWidth - 14, 18, { align: 'right' });

    // 2. Vehicle & Driver Profile Information Box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(14, 28, pageWidth - 28, 16, 2, 2, 'FD');

    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const colW = (pageWidth - 28) / 4;

    // Col 1: Vehicle Number
    doc.text('VEHICLE NUMBER', 18, 34);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(profile.vehicle_number || 'N/A', 18, 40);

    // Col 2: Driver Name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('DRIVER / OPERATOR', 18 + colW, 34);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(profile.name || 'N/A', 18 + colW, 40);

    // Col 3: Contact Phone
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('CONTACT PHONE', 18 + colW * 2, 34);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(profile.phone || 'N/A', 18 + colW * 2, 40);

    // Col 4: Account Role
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('ACCOUNT ROLE', 18 + colW * 3, 34);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text((profile.role || 'USER').toUpperCase(), 18 + colW * 3, 40);

    // 3. Financial KPI Summary Cards
    const cardY = 48;
    const cardW = (pageWidth - 28 - 9) / 4;
    const cardH = 15;

    // KPI 1: Gross Income
    doc.setFillColor(240, 253, 244); // green-50
    doc.setDrawColor(187, 247, 208); // green-200
    doc.roundedRect(14, cardY, cardW, cardH, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52); // green-800
    doc.text('GROSS INCOME', 18, cardY + 5);
    doc.setFontSize(11);
    doc.text(formatCurrency(totals.income), 18, cardY + 11);

    // KPI 2: Fuel & Running Costs
    doc.setFillColor(254, 242, 242); // red-50
    doc.setDrawColor(254, 202, 202); // red-200
    doc.roundedRect(14 + cardW + 3, cardY, cardW, cardH, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(153, 27, 27); // red-800
    doc.text('RUNNING COSTS', 18 + cardW + 3, cardY + 5);
    doc.setFontSize(11);
    doc.text(formatCurrency(totals.cost), 18 + cardW + 3, cardY + 11);

    // KPI 3: Other Expenses
    doc.setFillColor(255, 251, 235); // amber-50
    doc.setDrawColor(253, 230, 138); // amber-200
    doc.roundedRect(14 + (cardW + 3) * 2, cardY, cardW, cardH, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('OTHER EXPENSES', 18 + (cardW + 3) * 2, cardY + 5);
    doc.setFontSize(11);
    doc.text(formatCurrency(totals.other), 18 + (cardW + 3) * 2, cardY + 11);

    // KPI 4: Net Balance
    const isPositive = totals.balance >= 0;
    if (isPositive) {
      doc.setFillColor(239, 246, 255); // blue-50
      doc.setDrawColor(191, 219, 254);
      doc.setTextColor(30, 64, 175);
    } else {
      doc.setFillColor(254, 242, 242); // red-50
      doc.setDrawColor(254, 202, 202);
      doc.setTextColor(153, 27, 27);
    }
    doc.roundedRect(14 + (cardW + 3) * 3, cardY, cardW, cardH, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('NET SETTLEMENT', 18 + (cardW + 3) * 3, cardY + 5);
    doc.setFontSize(11);
    doc.text(formatCurrency(totals.balance), 18 + (cardW + 3) * 3, cardY + 11);

    // 4. Itemized Ledger Table (Financial Figures with Cost Details)
    const tableHeaders = [
      'Date',
      'Income ($)',
      'Cost ($)',
      'Cost Details',
      'Other ($)',
      'Net Balance ($)',
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

    // Summary footer row
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
      margin: { left: 14, right: 14 },
      head: [tableHeaders],
      body: tableRows.length > 0 ? tableRows : [['No records found for this period', '', '', '', '', '']],
      foot: footRows,
      theme: 'grid',
      styles: {
        fontSize: 8.5,
        cellPadding: 2.5,
        textColor: [15, 23, 42],
        valign: 'middle',
      },
      headStyles: {
        fillColor: [30, 41, 59], // slate-800
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
      },
      footStyles: {
        fillColor: [241, 245, 249], // slate-100
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: {
          cellWidth: 34,
          halign: 'center',
          fontStyle: 'bold',
          textColor: [15, 23, 42],
          fontSize: 9,
        }, // Date: BOLD, legible font for high clarity
        1: { cellWidth: 36, halign: 'right', fontStyle: 'bold' }, // Income
        2: { cellWidth: 36, halign: 'right', fontStyle: 'bold' }, // Cost
        3: { cellWidth: 85, halign: 'left' }, // Cost Details
        4: { cellWidth: 38, halign: 'right' }, // Other
        5: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }, // Net Balance
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didDrawPage: data => {
        // Page footer
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(
          `FleetLedger Commercial Audit Report — Page ${data.pageNumber}`,
          14,
          pageHeight - 6
        );
        doc.text(
          `Vehicle: ${profile.vehicle_number} | Driver: ${profile.name}`,
          pageWidth - 14,
          pageHeight - 6,
          { align: 'right' }
        );
      },
    });

    // 5. Signatures and Audit Sign-off (on last page)
    const finalY = (doc as any).lastAutoTable?.finalY || 160;
    const remainingSpace = pageHeight - finalY;

    // Check if we need a new page for signatures
    let sigY = finalY + 12;
    if (remainingSpace < 35) {
      doc.addPage();
      sigY = 24;
    }

    doc.setDrawColor(203, 213, 225); // slate-300
    doc.line(14, sigY, pageWidth - 14, sigY);

    const sigColW = (pageWidth - 28) / 2;

    // Driver Signature Line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Driver Signature & Certification:', 14, sigY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('I certify that the above recorded daily trips and expenses are complete and accurate.', 14, sigY + 12);
    doc.setDrawColor(15, 23, 42);
    doc.line(14, sigY + 22, 14 + 75, sigY + 22);
    doc.setFontSize(7);
    doc.text('Signature & Date', 14, sigY + 26);

    // Fleet Supervisor Signature Line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Fleet Manager / Auditor Approval:', 14 + sigColW, sigY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Verified against vehicle log receipts and approved for driver settlement.', 14 + sigColW, sigY + 12);
    doc.setDrawColor(15, 23, 42);
    doc.line(14 + sigColW, sigY + 22, 14 + sigColW + 75, sigY + 22);
    doc.setFontSize(7);
    doc.text('Authorized Signature & Stamp', 14 + sigColW, sigY + 26);

    // 6. Direct file download
    const cleanVehicle = (profile.vehicle_number || 'vehicle').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `FleetLedger_${cleanVehicle}_${from}_to_${to}.pdf`;
    doc.save(filename);

    return true;
  } catch (err) {
    console.error('Failed to generate PDF with jsPDF:', err);
    // Fallback to window.print if jsPDF fails
    try {
      window.print();
    } catch {}
    return false;
  }
}
