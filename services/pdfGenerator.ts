
// To inform TypeScript about the global variables from the CDN scripts
declare global {
  interface Window {
    jspdf: any;
  }
}

import { ContractRecord } from '../types';

export const generatePdf = (contractData: ContractRecord): void => {
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

    // --- Document Constants & Styling ---
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();
    const MARGIN = 20;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
    let y = MARGIN;

    // Corporate Color Palette
    const COLOR_PRIMARY = '#0D47A1'; // Deep Blue
    const COLOR_TEXT = '#212121'; // Almost Black
    const COLOR_TEXT_LIGHT = '#757575'; // Medium Grey

    // --- Helper Functions ---
    const checkPageBreak = (heightNeeded: number) => {
        if (y + heightNeeded > doc.internal.pageSize.getHeight() - MARGIN) {
            addFooter();
            doc.addPage();
            y = MARGIN;
        }
    };

    const addFooter = () => {
        const pageNum = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(COLOR_TEXT_LIGHT);
        doc.text(
            `Page ${pageNum}`, 
            PAGE_WIDTH - MARGIN, 
            doc.internal.pageSize.getHeight() - 10, 
            { align: 'right' }
        );
        doc.text(
            `Private Hire Agreement | ${contractData.customerName}`,
            MARGIN,
            doc.internal.pageSize.getHeight() - 10
        );
        doc.setLineWidth(0.1);
        doc.line(MARGIN, doc.internal.pageSize.getHeight() - 12, PAGE_WIDTH - MARGIN, doc.internal.pageSize.getHeight() - 12);
    };
    
    const drawSectionTitle = (title: string, sectionNumber: number) => {
        checkPageBreak(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(COLOR_PRIMARY);
        doc.text(`${sectionNumber}. ${title.toUpperCase()}`, MARGIN, y);
        y += 5;
        doc.setLineWidth(0.2);
        doc.setDrawColor(COLOR_PRIMARY);
        doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
        doc.setDrawColor(0); // Reset draw color
        y += 8;
    };

    const addClause = (text: string) => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(COLOR_TEXT);
        const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
        doc.text(lines, MARGIN, y);
        y += (lines.length * 4) + 4;
    };

    const addSubClause = (numbering: string, text: string) => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(COLOR_TEXT);
        const indent = 5;
        const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
        doc.text(lines, MARGIN + indent, y, { charSpace: 0.1 });
        doc.text(numbering, MARGIN, y); // Add numbering
        y += (lines.length * 4) + 3;
    };

    // --- PDF Construction ---

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(COLOR_PRIMARY);
    doc.text('PRIVATE HIRE VEHICLE AGREEMENT', PAGE_WIDTH / 2, y, { align: 'center' });
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLOR_TEXT_LIGHT);
    doc.text(`Ref: ${contractData.id || Date.now()}`, PAGE_WIDTH - MARGIN, y, { align: 'right' });
    doc.text(`Dated: ${new Date().toLocaleDateString('en-GB')}`, MARGIN, y);
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 10;

    // Preamble
    addClause(`This Private Hire Vehicle Agreement (hereinafter referred to as the "Agreement") is made and entered into on this ${new Date().toLocaleDateString('en-GB')},`);
    y += 2;
    addClause("BY AND BETWEEN:");
    y += 5;

    // Parties
    const riderIdDetails = [
        contractData.riderProfile.rapidoId ? `Rapido ID: ${contractData.riderProfile.rapidoId}` : null,
        contractData.riderProfile.uberId ? `Uber ID: ${contractData.riderProfile.uberId}` : null,
        contractData.riderProfile.olaId ? `Ola ID: ${contractData.riderProfile.olaId}` : null
    ].filter(Boolean).join('\n');

    const partyDetailsY = y;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLOR_TEXT);
    doc.text('THE RIDER', MARGIN, partyDetailsY);
    doc.text('THE CUSTOMER', MARGIN + CONTENT_WIDTH / 2 + 10, partyDetailsY);

    doc.setFont('helvetica', 'normal');
    const riderDetailsText = `${contractData.riderProfile.name}\nLicense No: ${contractData.riderProfile.licenseNumber}\n${riderIdDetails}`;
    const customerDetailsText = `${contractData.customerName}\nPickup: ${contractData.pickupLocation}\nDrop-off: ${contractData.dropLocation}`;
    
    doc.text(doc.splitTextToSize(riderDetailsText, CONTENT_WIDTH / 2 - 5), MARGIN, partyDetailsY + 6);
    doc.text(doc.splitTextToSize(customerDetailsText, CONTENT_WIDTH / 2 - 5), MARGIN + CONTENT_WIDTH / 2 + 10, partyDetailsY + 6);
    y += 35;


    addClause(`The Rider and the Customer shall hereinafter be collectively referred to as the "Parties" and individually as a "Party".`);
    y += 5;

    // Recitals (WHEREAS clauses)
    doc.setFont('helvetica', 'bold');
    doc.text('WHEREAS:', MARGIN, y);
    y += 6;
    addSubClause('A.', 'The Rider is engaged in the business of providing transportation services and holds all necessary permits and licenses to operate as a private hire vehicle driver.');
    addSubClause('B.', 'The Customer desires to engage the Rider to provide transportation services for a fixed term, and the Rider has agreed to provide such services on the terms and conditions set forth in this Agreement.');
    y += 4;
    addClause('NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the Parties agree as follows:');
    y += 5;

    // Section 1: Scope of Services
    drawSectionTitle('Scope of Services', 1);
    addSubClause('1.1', `The Rider agrees to provide daily transportation services to the Customer from the designated pick-up to the drop-off location.`);
    addSubClause('1.2', `The estimated daily travel is approximately ${contractData.dailyDistance} kilometers with an approximate duration of ${contractData.dailyDuration} minutes.`);

    // Section 2: Term of Agreement
    drawSectionTitle('Term of Agreement', 2);
    addSubClause('2.1', `This Agreement shall commence on ${new Date(contractData.startDate).toLocaleDateString('en-GB')} and shall continue in full force and effect until ${new Date(contractData.endDate).toLocaleDateString('en-GB')} (the "Term"), unless terminated earlier in accordance with the provisions of this Agreement.`);
    addSubClause('2.2', `The total duration of this agreement is for ${contractData.numberOfDays} days.`);
    
    // Section 3: Financial Consideration
    drawSectionTitle('Financial Consideration', 3);
    addSubClause('3.1', `In consideration for the services rendered by the Rider, the Customer shall pay a total, all-inclusive fee of INR ${contractData.totalFare.toFixed(2)} for the entire Term.`);
    addSubClause('3.2', 'This fee is calculated based on the daily travel estimates and is fixed for the duration of the Term. No additional charges for fuel, tolls, or standard waiting times shall be applicable unless mutually agreed upon in writing.');
    
    // Section 4: Obligations of the Rider
    drawSectionTitle('Obligations of the Rider', 4);
    addSubClause('4.1', `The Rider shall ensure the vehicle used for providing the services is well-maintained, clean, insured, and compliant with all applicable laws and regulations.`);
    addSubClause('4.2', `The Rider shall maintain a valid driving license and all other necessary permits throughout the Term.`);
    addSubClause('4.3', `The Rider shall conduct himself in a professional, courteous, and respectful manner at all times.`);
    addSubClause('4.4', `The Rider shall notify the Customer in a timely manner of any potential delays or inability to provide the service on a particular day due to unforeseen circumstances.`);

    // Section 5: Termination
    drawSectionTitle('Termination', 5);
    addSubClause('5.1', `The Customer may terminate this Agreement by providing a written notice of ten (10) days to the Rider.`);
    addSubClause('5.2', `In the event of termination by the Customer as per clause 5.1, the Rider shall refund the pro-rated amount for the unutilized portion of the Term to the Customer within seven (7) business days.`);
    
    // Section 6: Governing Law and Jurisdiction
    drawSectionTitle('Governing Law and Jurisdiction', 6);
    addSubClause('6.1', `This Agreement shall be governed by and construed in accordance with the laws of India, including the Indian Contract Act, 1872.`);
    addSubClause('6.2', `Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts.`);
    
    // Section 7: Entire Agreement
    drawSectionTitle('Entire Agreement', 7);
    addSubClause('7.1', `This Agreement constitutes the entire agreement between the Parties and supersedes all prior oral or written agreements, understandings, or arrangements.`);

    // Signature Block
    y += 15;
    checkPageBreak(60);
    addClause('IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.');
    
    y += 20;

    const signatureBlockWidth = CONTENT_WIDTH / 2 - 10;
    const sigLineY = y + 20;

    // Rider Signature
    doc.line(MARGIN, sigLineY, MARGIN + signatureBlockWidth, sigLineY);
    doc.text("For the Rider", MARGIN, sigLineY + 5);
    doc.text(`Name: ${contractData.riderProfile.name}`, MARGIN, sigLineY + 10);
    
    // Customer Signature
    const customerSigX = PAGE_WIDTH - MARGIN - signatureBlockWidth;
    doc.line(customerSigX, sigLineY, customerSigX + signatureBlockWidth, sigLineY);
    doc.text("For the Customer", customerSigX, sigLineY + 5);
    doc.text(`Name: ${contractData.customerName}`, customerSigX, sigLineY + 10);

    // Finalize pages by adding footers
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++){
        doc.setPage(i);
        addFooter();
    }
    
    doc.save(`RideAgreement_${contractData.customerName.replace(/\s/g, '_')}.pdf`);
};
