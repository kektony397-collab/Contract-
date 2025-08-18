// To inform TypeScript about the global variables from the CDN scripts
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

export const generatePdf = async (element: HTMLElement, fileName: string): Promise<void> => {
    if (!element) {
        console.error("PDF generation failed: element not found.");
        return;
    }
    
    // Check if libraries are loaded
    if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        console.error("PDF generation libraries (html2canvas, jspdf) not loaded.");
        return;
    }
    
    const { jsPDF } = window.jspdf;
    
    try {
        const canvas = await window.html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            backgroundColor: null, // Use element's background
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${fileName}.pdf`);
        
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};
