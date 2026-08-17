import { jsPDF } from 'jspdf';
import { DBOrder } from '../components/OrderTracker';
import { Product } from '../types';

export const generateOrderPDF = (
  order: DBOrder, 
  getProductDetails: (id: string) => Partial<Product> & { isArchived?: boolean }
) => {
  // Initialize A4 document (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = margin;

  // Helper for brutalist borders
  const drawThickRect = (x: number, yPos: number, w: number, h: number, filled = false) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.8);
    if (filled) {
      doc.setFillColor(242, 242, 242);
      doc.rect(x, yPos, w, h, 'FD');
    } else {
      doc.rect(x, yPos, w, h, 'S');
    }
  };

  const drawHeavyDivider = (yPos: number) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.2);
    doc.line(margin, yPos, margin + contentWidth, yPos);
  };

  const drawThinDivider = (yPos: number) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, margin + contentWidth, yPos);
  };

  // 1. TOP HEADER BANNER (Brutalist Black Block)
  doc.setFillColor(0, 0, 0);
  doc.rect(margin, y, contentWidth, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.text('D.P GEMS // SECURE ORDER MANIFEST', margin + 4, y + 7.5);

  doc.setFontSize(8);
  doc.text('CLASSIFIED EXTRACTION PROTOCOL // PROOF OF ACQUISITION', margin + 4, y + 13.5);

  const issueDate = new Date(order.created_at || Date.now()).toISOString().split('T')[0];
  doc.text(`DATE: ${issueDate}`, margin + contentWidth - 4, y + 7.5, { align: 'right' });
  doc.text('STATUS: VERIFIED', margin + contentWidth - 4, y + 13.5, { align: 'right' });

  y += 22;

  // 2. ORDER TELEMETRY SUMMARY BOX (Brutalist Grid)
  const metaBoxHeight = 36;
  drawThickRect(margin, y, contentWidth, metaBoxHeight, true);

  doc.setTextColor(0, 0, 0);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);

  // Left Column
  doc.text('ORDER UUID:', margin + 4, y + 6);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text(String(order.order_id || 'N/A'), margin + 4, y + 11);

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text('OPERATIVE / CUSTOMER:', margin + 4, y + 18);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text(String(order.customer_email || 'N/A'), margin + 4, y + 23);

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text('TRANSACTION REFERENCE:', margin + 4, y + 30);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text(String(order.transaction_id || 'STRIPE_GATEWAY_SECURE_PAYMENT'), margin + 4, y + 34.5);

  // Right Column
  const rightColX = margin + 100;
  const statusStr = String(order.status || 'VERIFIED').toUpperCase();
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text('DISPATCH STATUS:', rightColX, y + 6);
  
  // Status highlighted text
  doc.setFillColor(0, 0, 0);
  doc.rect(rightColX, y + 8, 76, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text(` ${statusStr} `, rightColX + 2, y + 12.5);

  doc.setTextColor(0, 0, 0);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text('LOGISTICS CARRIER:', rightColX, y + 19);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text(String(order.carrier || 'GLOBAL COURIER DISPATCH'), rightColX, y + 24);

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text('TRACKING / WAYBILL:', rightColX, y + 30);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text(String(order.tracking_number || 'TRK-GEMS-' + (order.order_id ? order.order_id.substring(0, 8).toUpperCase() : 'PENDING')), rightColX, y + 34.5);

  y += metaBoxHeight + 6;

  // 3. TABLE HEADER (BRUTALIST INVENTORY)
  drawHeavyDivider(y);
  y += 2;

  doc.setFillColor(0, 0, 0);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);

  const colX = {
    index: margin + 3,
    itemCode: margin + 12,
    desc: margin + 45,
    status: margin + 115,
    qty: margin + 140,
    price: margin + 155,
    total: margin + contentWidth - 3
  };

  doc.text('#', colX.index, y + 4.8);
  doc.text('ITEM CODE', colX.itemCode, y + 4.8);
  doc.text('ARTIFACT DESCRIPTION', colX.desc, y + 4.8);
  doc.text('RECORD', colX.status, y + 4.8);
  doc.text('QTY', colX.qty, y + 4.8);
  doc.text('UNIT', colX.price, y + 4.8);
  doc.text('TOTAL', colX.total, y + 4.8, { align: 'right' });

  y += 8;

  // 4. TABLE ROWS
  const items = order.items && order.items.length > 0 ? order.items : [];
  const currencySymbol = (order.currency || 'gbp').toLowerCase() === 'gbp' ? 'GBP ' : 'USD ';

  doc.setTextColor(0, 0, 0);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);

  let calculatedSubtotal = 0;

  if (items.length === 0) {
    drawThinDivider(y);
    doc.text('1x Encrypted Checkout Batch (Details retained in Stripe metadata)', margin + 12, y + 5);
    doc.text('1', colX.qty, y + 5);
    doc.text(`${currencySymbol}${(order.amount / 100).toFixed(2)}`, colX.total, y + 5, { align: 'right' });
    y += 8;
  } else {
    items.forEach((item, idx) => {
      const details = getProductDetails(item.id);
      const qty = item.quantity || item.q || 1;
      const unitPrice = details.price || 0;
      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      // Alternating light row fill
      if (idx % 2 === 1) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y, contentWidth, 7.5, 'F');
      }

      drawThinDivider(y);
      y += 5.2;

      doc.setFont('courier', 'bold');
      doc.text(String(idx + 1).padStart(2, '0'), colX.index, y);
      
      doc.setFont('courier', 'normal');
      doc.text(String(item.id || 'N/A').substring(0, 14), colX.itemCode, y);

      const truncatedName = String(details.name || 'UNKNOWN ARTIFACT').substring(0, 32).toUpperCase();
      doc.text(truncatedName, colX.desc, y);

      if (details.isArchived) {
        doc.setFont('courier', 'bold');
        doc.text('[VAULTED]', colX.status, y);
        doc.setFont('courier', 'normal');
      } else {
        doc.text('ACTIVE', colX.status, y);
      }

      doc.text(String(qty), colX.qty, y);
      doc.text(`${currencySymbol}${unitPrice}`, colX.price, y);
      doc.text(`${currencySymbol}${lineTotal.toFixed(2)}`, colX.total, y, { align: 'right' });

      y += 3;
    });
  }

  drawHeavyDivider(y);
  y += 6;

  // 5. TOTALS & SUMMARY SECTION (RIGHT ALIGNED BOX)
  const totalBoxWidth = 85;
  const totalBoxX = margin + contentWidth - totalBoxWidth;
  const totalBoxY = y;
  const totalBoxHeight = 28;

  drawThickRect(totalBoxX, totalBoxY, totalBoxWidth, totalBoxHeight, true);

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text('SUBTOTAL:', totalBoxX + 4, totalBoxY + 6.5);
  doc.setFont('courier', 'normal');
  const subtotalDisplay = calculatedSubtotal > 0 
    ? `${currencySymbol}${calculatedSubtotal.toFixed(2)}` 
    : `${currencySymbol}${(order.amount / 100).toFixed(2)}`;
  doc.text(subtotalDisplay, totalBoxX + totalBoxWidth - 4, totalBoxY + 6.5, { align: 'right' });

  doc.setFont('courier', 'bold');
  doc.text('EXTRACTION / LOGISTICS:', totalBoxX + 4, totalBoxY + 13);
  doc.setFont('courier', 'normal');
  doc.text('INCLUDED (0.00)', totalBoxX + totalBoxWidth - 4, totalBoxY + 13, { align: 'right' });

  doc.setFillColor(0, 0, 0);
  doc.rect(totalBoxX, totalBoxY + 17, totalBoxWidth, 11, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.text('FINAL AMOUNT PAID:', totalBoxX + 4, totalBoxY + 24);
  const finalTotal = `${currencySymbol}${(order.amount / 100).toFixed(2)}`;
  doc.text(finalTotal, totalBoxX + totalBoxWidth - 4, totalBoxY + 24, { align: 'right' });

  // 6. LEFT NOTE & QR / BARCODE AESTHETIC PLACEHOLDER
  doc.setTextColor(0, 0, 0);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.text('[AUTHENTICITY & SECURITY VERIFICATION]', margin, y + 6);
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.text('This document serves as an immutable cryptographic acquisition manifest.', margin, y + 11);
  doc.text('All physical garments are serialized with micro-woven NFC sector tags.', margin, y + 15);
  doc.text('Historical vaulted items remain valid for lifetime archive warranty.', margin, y + 19);

  // Decorative barcode aesthetic lines
  let barcodeX = margin;
  const barcodeY = y + 23;
  const barcodeWidths = [1.2, 0.4, 0.8, 1.8, 0.4, 0.6, 1.4, 0.4, 0.9, 1.6, 0.5, 0.7, 1.5, 0.4, 1.2, 0.5, 0.8, 1.4];
  doc.setFillColor(0, 0, 0);
  barcodeWidths.forEach((w) => {
    doc.rect(barcodeX, barcodeY, w, 6, 'F');
    barcodeX += w + 0.9;
  });
  doc.setFontSize(6.5);
  doc.text(`SECURE-HASH-${order.order_id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 24).toUpperCase()}`, margin, barcodeY + 8.5);

  y = totalBoxY + totalBoxHeight + 14;

  // 7. FOOTER SECTION
  drawHeavyDivider(pageHeight - 20);
  
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('D.P GEMS ARCHIVE // SYSTEM SECURE // WORLDWIDE EXTRACTION INFRASTRUCTURE', margin, pageHeight - 14);
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.text('EST. 2024 // ENCRYPTED TERMINAL DISPATCH // ALL RIGHTS RESERVED', margin, pageHeight - 10);
  doc.text(`PAGE 1 OF 1  //  TIMESTAMP: ${new Date().toISOString()}`, margin + contentWidth, pageHeight - 10, { align: 'right' });

  // 8. TRIGGER PDF DOWNLOAD
  const cleanOrderId = (order.order_id || 'ORDER').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 24);
  doc.save(`DP_GEMS_MANIFEST_${cleanOrderId}.pdf`);
};
