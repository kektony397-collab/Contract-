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
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;
    const today = new Date().toLocaleDateString('en-GB');

    // Helper for word wrapping
    const splitText = (text: string, maxWidth: number): string[] => {
        return doc.splitTextToSize(text, maxWidth);
    };

    // --- HEADER ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Ride Share Agreement', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date of Issue: ${today}`, pageWidth - margin, y, { align: 'right' });
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // --- PARTIES ---
    doc.setFontSize(12);
    const introText = splitText('This Ride Share Agreement (the "Agreement") is made and entered into by and between the following parties:', pageWidth - margin * 2);
    doc.text(introText, margin, y);
    y += introText.length * 5 + 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text('The Rider:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(contractData.riderProfile.name || 'N/A', margin + 35, y);
    y += 7;
    if (contractData.riderProfile.licenseNumber) {
        doc.text(`License No: ${contractData.riderProfile.licenseNumber}`, margin + 35, y);
        y += 7;
    }

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('The Customer:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(contractData.customerName || 'N/A', margin + 35, y);
    y += 15;

    // --- AGREEMENT DETAILS ---
    const addSection = (title: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(title, margin, y);
        y += 6;
        doc.setLineWidth(0.2);
        doc.line(margin, y, margin + 50, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
    };
    
    addSection('1. Description of Services');
    const serviceDetails = `The Rider agrees to provide daily transportation services to the Customer from the pickup location of ${contractData.pickupLocation} to the drop-off location of ${contractData.dropLocation}. The estimated daily travel is ${contractData.dailyDistance} km and is expected to take approximately ${contractData.dailyDuration} minutes.`;
    const splitService = splitText(serviceDetails, pageWidth - margin * 2);
    doc.text(splitService, margin, y);
    y += splitService.length * 5 + 10;
    
    addSection('2. Term of Agreement');
    doc.text(`This Agreement shall commence on ${new Date(contractData.startDate).toLocaleDateString('en-GB')} and shall continue in full force and effect until ${new Date(contractData.endDate).toLocaleDateString('en-GB')}, for a total duration of ${contractData.numberOfDays} days.`, margin, y);
    y += 15;

    addSection('3. Compensation');
    doc.text(`The total compensation for the services to be rendered under this Agreement is ₹${contractData.totalFare.toFixed(2)}. This amount is calculated based on a daily rate for the agreed term of the contract.`, margin, y);
    y += 15;

    addSection('4. Terms and Conditions');
    const terms = [
      { en: "1. Service Cancellation: The ride may be cancelled if the Rider's vehicle is non-operational due to mechanical breakdown or scheduled maintenance.", hi: "१. सेवा रद्दीकरण: यदि राइडर का वाहन यांत्रिक खराबी या निर्धारित रखरखाव के कारण चालू नहीं है तो राइड रद्द की जा सकती है।" },
      { en: "2. Code of Conduct: The Rider shall maintain a professional and respectful demeanor toward the Customer at all times.", hi: "२. आचार संहिता: राइडर हर समय ग्राहक के प्रति एक पेशेवर और सम्मानजनक व्यवहार बनाए रखेगा।" },
      { en: "3. Contract Termination: The Customer may terminate this Agreement after an initial period of ten (10) days. Upon termination, the Rider shall refund the pro-rated amount for the remainder of the contract term.", hi: "३. अनुबंध समाप्ति: ग्राहक दस (10) दिनों की प्रारंभिक अवधि के बाद इस अनुबंध को समाप्त कर सकता है। समाप्ति पर, राइडर अनुबंध की शेष अवधि के लिए आनुपातिक राशि वापस करेगा।" }
    ];

    doc.setFontSize(10);
    terms.forEach(term => {
        if (y > pageHeight - 60) { // Check for page break before adding new term
            doc.addPage();
            y = margin;
        }
        const enLines = splitText(term.en, pageWidth - margin * 2);
        doc.setFont('helvetica', 'bold');
        doc.text(enLines, margin, y);
        y += enLines.length * 4;

        const hiLines = splitText(term.hi, pageWidth - margin * 2);
        doc.setFont('helvetica', 'italic');
        doc.text(hiLines, margin, y);
        y += hiLines.length * 4 + 4;
    });
    
    // --- SIGNATURES ---
    y = pageHeight - 40; // Position signatures at the bottom
    doc.line(margin, y, margin + 70, y);
    doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text("Rider's Signature", margin, y);
    doc.text("Customer's Signature", pageWidth - margin, y, { align: 'right' });

    doc.save(`RideShareAgreement-${contractData.customerName.replace(/\s/g, '_')}.pdf`);
};