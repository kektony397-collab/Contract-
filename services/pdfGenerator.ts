// To inform TypeScript about the global variables from the CDN scripts
declare global {
  interface Window {
    jspdf: any;
  }
}

import { ContractData } from '../types';

export const generatePdf = (contractData: ContractData): void => {
    if (typeof window.jspdf === 'undefined') {
        console.error("PDF generation library (jspdf) not loaded.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const PAGE_WIDTH = doc.internal.pageSize.getWidth();
    const MARGIN = 15;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
    let y = 0;

    // --- Colors & Fonts ---
    const COLOR_PRIMARY_DARK = '#2c3e50'; // Very dark blue
    const COLOR_GREY_LIGHT = '#ecf0f1'; // Light grey for boxes
    const COLOR_TEXT_DARK = '#34495e'; // Dark grey text
    const COLOR_TEXT_LIGHT = '#7f8c8d'; // Lighter grey text
    const COLOR_WHITE = '#ffffff';

    // --- Helper Functions ---
    const splitText = (text: string, maxWidth: number) => doc.splitTextToSize(text, maxWidth);

    const checkPageBreak = (heightNeeded: number) => {
        if (y + heightNeeded > doc.internal.pageSize.getHeight() - MARGIN) {
            addFooter();
            doc.addPage();
            y = MARGIN;
            addHeader(); // Re-add header on new page
        }
    };
    
    const addHeader = () => {
        doc.setFillColor(COLOR_PRIMARY_DARK);
        doc.rect(0, 0, PAGE_WIDTH, 28, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(COLOR_WHITE);
        doc.text('RIDE SHARE AGREEMENT', PAGE_WIDTH / 2, 17, { align: 'center' });
        y = 38;
    };
    
    const addFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(COLOR_TEXT_LIGHT);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, doc.internal.pageSize.getHeight() - 12, PAGE_WIDTH - MARGIN, doc.internal.pageSize.getHeight() - 12);
        doc.text(`Page ${pageCount}`, PAGE_WIDTH - MARGIN, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
        doc.text(`CONFIDENTIAL DOCUMENT`, MARGIN, doc.internal.pageSize.getHeight() - 8);
    };

    const drawSectionTitle = (title: string) => {
        checkPageBreak(12);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLOR_PRIMARY_DARK);
        doc.text(title, MARGIN, y);
        y += 4;
        doc.setLineWidth(0.5);
        doc.line(MARGIN, y, MARGIN + 25, y);
        y += 8;
    };

    // --- PDF Construction ---

    addHeader();

    // Parties Section
    doc.setFontSize(10);
    doc.setTextColor(COLOR_TEXT_DARK);
    const intro = `This Ride Share Agreement ("Agreement") is entered into as of ${new Date().toLocaleDateString('en-GB')}, by and between:`;
    doc.text(splitText(intro, CONTENT_WIDTH), MARGIN, y);
    y += 12;

    const boxWidth = CONTENT_WIDTH / 2 - 5;
    const boxHeight = 40;
    doc.setFillColor(COLOR_GREY_LIGHT);
    doc.roundedRect(MARGIN, y, boxWidth, boxHeight, 3, 3, 'F');
    doc.roundedRect(MARGIN + boxWidth + 10, y, boxWidth, boxHeight, 3, 3, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARY_DARK);
    doc.text('The Rider', MARGIN + 5, y + 8);
    doc.text('The Customer', MARGIN + boxWidth + 15, y + 8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_TEXT_DARK);
    doc.text(`Name: ${contractData.riderProfile.name || 'N/A'}`, MARGIN + 5, y + 18);
    doc.text(`License No: ${contractData.riderProfile.licenseNumber || 'N/A'}`, MARGIN + 5, y + 25);
    doc.text(`Name: ${contractData.customerName || 'N/A'}`, MARGIN + boxWidth + 15, y + 18);
    y += boxHeight + 15;

    // Agreement Details
    drawSectionTitle('1. Service & Term Details');
    doc.setFontSize(10);
    const serviceText = `The Rider agrees to provide daily transportation for the Customer from ${contractData.pickupLocation} to ${contractData.dropLocation}.`;
    doc.text(splitText(serviceText, CONTENT_WIDTH), MARGIN, y);
    y += splitText(serviceText, CONTENT_WIDTH).length * 4 + 4;

    doc.setFont('helvetica', 'bold');
    doc.text('Contract Term:', MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${new Date(contractData.startDate).toLocaleDateString('en-GB')} to ${new Date(contractData.endDate).toLocaleDateString('en-GB')} (${contractData.numberOfDays} days)`, MARGIN + 30, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Daily Estimate:', MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${contractData.dailyDistance} km / ${contractData.dailyDuration} min`, MARGIN + 30, y);
    y += 12;

    // Compensation
    drawSectionTitle('2. Compensation');
    doc.setFillColor(COLOR_GREY_LIGHT);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 20, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Total compensation for the services rendered under this Agreement:', MARGIN + 5, y + 8);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`₹${contractData.totalFare.toFixed(2)}`, PAGE_WIDTH - MARGIN - 5, y + 14, { align: 'right' });
    y += 20 + 12;

    // Terms and Conditions
    drawSectionTitle('3. Terms and Conditions');
    const terms = [
      { en: "1. Service Availability: The ride may be cancelled if the Rider's vehicle is non-operational due to mechanical breakdown or scheduled maintenance. The Rider shall provide advance notice where possible.", hi: "१. सेवा उपलब्धता: राइडर का वाहन यांत्रिक खराबी या निर्धारित रखरखाव के कारण चालू न होने की स्थिति में राइड रद्द की जा सकती है। राइडर जहां संभव हो, अग्रिम सूचना प्रदान करेगा।" },
      { en: "2. Professional Conduct: The Rider shall maintain a professional and respectful demeanor toward the Customer at all times.", hi: "२. पेशेवर आचरण: राइडर हर समय ग्राहक के प्रति एक पेशेवर और सम्मानजनक व्यवहार बनाए रखेगा।" },
      { en: "3. Customer Termination Clause: The Customer may terminate this Agreement after an initial period of ten (10) days. Upon such termination, the Rider shall refund the pro-rated amount for the remainder of the contract term.", hi: "३. अनुबंध समाप्ति का प्रावधान: ग्राहक दस (10) दिनों की प्रारंभिक अवधि के बाद इस अनुबंध को समाप्त कर सकता है। ऐसी समाप्ति पर, राइडर अनुबंध की शेष अवधि के लिए आनुपातिक राशि वापस करेगा।" }
    ];

    doc.setFontSize(9);
    terms.forEach(term => {
        const enLines = splitText(term.en, CONTENT_WIDTH);
        const hiLines = splitText(term.hi, CONTENT_WIDTH);
        checkPageBreak((enLines.length + hiLines.length) * 3.5 + 4);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLOR_TEXT_DARK);
        doc.text(enLines, MARGIN, y);
        y += enLines.length * 3.5;

        doc.setFont('helvetica', 'italic');
        doc.setTextColor(COLOR_TEXT_LIGHT);
        doc.text(hiLines, MARGIN, y);
        y += hiLines.length * 3.5 + 4;
    });

    // Signatures
    const signatureY = doc.internal.pageSize.getHeight() - 50;
    if (y > signatureY) { // Add new page if not enough space for signatures
        addFooter();
        doc.addPage();
        y = MARGIN;
        addHeader();
        y = signatureY;
    } else {
        y = signatureY;
    }

    const signatureBlockWidth = 80;
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, MARGIN + signatureBlockWidth, y);
    doc.line(PAGE_WIDTH - MARGIN - signatureBlockWidth, y, PAGE_WIDTH - MARGIN, y);
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_TEXT_DARK);
    doc.text("Rider's Signature", MARGIN, y);
    doc.text("Customer's Signature", PAGE_WIDTH - MARGIN, y, { align: 'right' });
    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(COLOR_TEXT_LIGHT);
    doc.text(`(${contractData.riderProfile.name})`, MARGIN, y);
    doc.text(`(${contractData.customerName})`, PAGE_WIDTH - MARGIN, y, { align: 'right' });

    // Finalize pages
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++){
        doc.setPage(i);
        addFooter();
    }

    doc.save(`RideAgreement_${contractData.customerName.replace(/\s/g, '_')}.pdf`);
};
