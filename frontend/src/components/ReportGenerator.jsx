import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { API_BASE_URL } from '../config';

export default function ReportGenerator({ isDarkMode }) {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('daily');

  // Format number with proper comma separation (e.g., 200,000 not 2,00,000)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Draw a simple colored area chart in PDF
  const drawChart = (pdf, chartData, yPosition, pageWidth) => {
    const chartWidth = 170;
    const chartHeight = 80;
    const chartX = 20;
    const chartY = yPosition;

    // Chart background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(chartX, chartY, chartWidth, chartHeight, 'F');

    // Chart border
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(chartX, chartY, chartWidth, chartHeight);

    if (chartData && chartData.length > 0) {
      const maxIncome = Math.max(...chartData.map(d => d.income || 0));
      const maxExpenses = Math.max(...chartData.map(d => d.expenses || 0));
      const maxValue = Math.max(maxIncome, maxExpenses);

      if (maxValue > 0) {
        const barWidth = chartWidth / (chartData.length * 2.5);
        const scale = chartHeight / maxValue;

        chartData.forEach((day, index) => {
          const x = chartX + 10 + index * (barWidth * 2.2);

          // Income bar (green)
          const incomeHeight = (day.income || 0) * scale;
          pdf.setFillColor(34, 197, 94); // Green
          pdf.rect(x, chartY + chartHeight - incomeHeight, barWidth * 0.9, incomeHeight, 'F');

          // Expenses bar (red)
          const expensesHeight = (day.expenses || 0) * scale;
          pdf.setFillColor(239, 68, 68); // Red
          pdf.rect(x + barWidth, chartY + chartHeight - expensesHeight, barWidth * 0.9, expensesHeight, 'F');
        });
      }
    }

    return chartY + chartHeight + 10;
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      // Fetch report data from backend
      const response = await fetch(
        `${API_BASE_URL}/api/sales/report_data/?type=${reportType}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        alert('Failed to fetch report data');
        setLoading(false);
        return;
      }

      const reportData = await response.json();

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header with Shop Name
      pdf.setFontSize(28);
      pdf.setTextColor(59, 130, 246);
      pdf.text('ProShop', pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 12;
      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      const reportTitle = reportType === 'weekly' ? 'Weekly Business Report' : 'Daily Business Report';
      pdf.text(reportTitle, pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Period: ${reportData.date_range.start} to ${reportData.date_range.end}`,
        pageWidth / 2,
        yPosition,
        { align: 'center' }
      );

      yPosition += 15;

      // Summary Section with better styling
      pdf.setFontSize(14);
      pdf.setTextColor(59, 130, 246);
      pdf.setFont(undefined, 'bold');
      pdf.text('📊 Summary', 20, yPosition);
      pdf.setFont(undefined, 'normal');

      yPosition += 10;
      pdf.setFontSize(10);

      const summaryData = [
        {
          label: 'Total Income',
          value: formatCurrency(reportData.summary.total_income),
          color: [34, 197, 94],
        },
        {
          label: 'Total Expenses',
          value: formatCurrency(reportData.summary.total_expenses),
          color: [239, 68, 68],
        },
        {
          label: 'Net Profit',
          value: formatCurrency(reportData.summary.net_profit),
          color: [59, 130, 246],
        },
        {
          label: 'Total Sales',
          value: reportData.summary.total_sales,
          color: [168, 85, 247],
        },
        {
          label: 'Items Sold',
          value: reportData.summary.total_items_sold,
          color: [245, 158, 11],
        },
        {
          label: 'Total Stocks',
          value: reportData.summary.total_stocks,
          color: [6, 182, 212],
        },
      ];

      let col1X = 20;
      let col2X = 105;
      let summaryY = yPosition;

      summaryData.forEach((item, index) => {
        const xPos = index % 2 === 0 ? col1X : col2X;
        const yPos = summaryY + Math.floor(index / 2) * 14;

        // Color indicator
        pdf.setFillColor(...item.color);
        pdf.rect(xPos, yPos - 2, 2, 4, 'F');

        pdf.setTextColor(100, 100, 100);
        pdf.text(`${item.label}:`, xPos + 5, yPos);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'bold');
        pdf.text(String(item.value), xPos + 55, yPos);
        pdf.setFont(undefined, 'normal');
      });

      yPosition = summaryY + 50;

      // Chart Section with colored bars
      if (reportData.chart_data && reportData.chart_data.length > 0) {
        pdf.setFontSize(12);
        pdf.setTextColor(59, 130, 246);
        pdf.setFont(undefined, 'bold');
        pdf.text('📈 Daily Breakdown Chart', 20, yPosition);
        pdf.setFont(undefined, 'normal');

        yPosition += 8;

        // Draw colored chart
        yPosition = drawChart(pdf, reportData.chart_data, yPosition, pageWidth);

        // Daily Breakdown Table
        pdf.setFontSize(10);
        pdf.setTextColor(59, 130, 246);
        pdf.setFont(undefined, 'bold');
        pdf.text('Daily Details:', 20, yPosition);
        pdf.setFont(undefined, 'normal');

        yPosition += 8;
        pdf.setFontSize(9);

        // Table headers with background
        pdf.setFillColor(230, 230, 230);
        pdf.rect(20, yPosition - 4, 170, 6, 'F');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Date', 22, yPosition);
        pdf.text('Income', 70, yPosition);
        pdf.text('Expenses', 120, yPosition);
        pdf.text('Sales', 170, yPosition);

        yPosition += 8;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition - 2, 190, yPosition - 2);

        // Table data
        pdf.setTextColor(0, 0, 0);
        reportData.chart_data.forEach((day) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.text(day.day.substring(0, 15), 22, yPosition);
          pdf.text(formatCurrency(day.income), 70, yPosition);
          pdf.text(formatCurrency(day.expenses), 120, yPosition);
          pdf.text(String(day.sales_count), 170, yPosition);

          yPosition += 7;
        });
      }

      // Sales Details Page
      if (reportData.sales && reportData.sales.length > 0) {
        pdf.addPage();
        yPosition = 20;

        pdf.setFontSize(12);
        pdf.setTextColor(59, 130, 246);
        pdf.setFont(undefined, 'bold');
        pdf.text('🛍️ Sales Details', 20, yPosition);
        pdf.setFont(undefined, 'normal');

        yPosition += 10;
        pdf.setFontSize(9);

        // Table headers with background
        pdf.setFillColor(230, 230, 230);
        pdf.rect(20, yPosition - 4, 170, 6, 'F');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Product', 22, yPosition);
        pdf.text('Qty', 80, yPosition);
        pdf.text('Price/Unit', 110, yPosition);
        pdf.text('Total', 160, yPosition);

        yPosition += 8;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition - 2, 190, yPosition - 2);

        // Sales data
        pdf.setTextColor(0, 0, 0);
        reportData.sales.forEach((sale) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }

          const productName = sale.stock_name.substring(0, 20);
          pdf.text(productName, 22, yPosition);
          pdf.text(String(sale.quantity), 80, yPosition);
          pdf.text(formatCurrency(sale.price_per_unit), 110, yPosition);
          pdf.text(formatCurrency(sale.total_amount), 160, yPosition);

          yPosition += 7;
        });
      }

      // Footer with timestamp
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${totalPages} • Generated on ${new Date().toLocaleString()}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Download PDF
      const fileName = `ProShop-${reportType}-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
      }}
    >
      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
        disabled={loading}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
          background: isDarkMode ? '#0f1419' : '#ffffff',
          color: isDarkMode ? 'white' : '#1a1a1a',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        <option value="daily">Daily Report</option>
        <option value="weekly">Weekly Report</option>
      </select>

      <button
        onClick={generatePDF}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s',
          border: 'none',
        }}
      >
        {loading ? 'Generating...' : '📥 Download PDF Report'}
      </button>
    </div>
  );
}
