/**
 * Invoice Generator - PDF Generation Module
 * Handles PDF download functionality using html2pdf.js
 */

// PDF Generation Configuration
const PDF_CONFIG = {
    margin: 10,
    filename: 'invoice.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
    },
    jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
    }
};

/**
 * Download invoice as PDF
 */
async function downloadPDF() {
    const invoiceData = getInvoiceData();
    const previewElement = document.getElementById('invoicePreview');
    
    if (!previewElement) {
        showToast('Error: Invoice preview not found', 'error');
        return;
    }
    
    // Show loading state
    const downloadBtn = document.getElementById('downloadPdfBtn');
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="30 70"></circle>
        </svg>
        Generating...
    `;
    downloadBtn.disabled = true;
    
    try {
        // Configure PDF options
        const config = {
            ...PDF_CONFIG,
            filename: `${invoiceData.invoiceNumber || 'invoice'}.pdf`
        };
        
        // Generate and download PDF
        await html2pdf()
            .set(config)
            .from(previewElement)
            .save();
        
        showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
        // Restore button state
        downloadBtn.innerHTML = originalContent;
        downloadBtn.disabled = false;
    }
}

/**
 * Generate PDF and return as blob (for email attachment, etc.)
 */
async function generatePDFBlob() {
    const invoiceData = getInvoiceData();
    const previewElement = document.getElementById('invoicePreview');
    
    if (!previewElement) {
        throw new Error('Invoice preview not found');
    }
    
    const config = {
        ...PDF_CONFIG,
        filename: `${invoiceData.invoiceNumber || 'invoice'}.pdf`
    };
    
    return await html2pdf()
        .set(config)
        .from(previewElement)
        .outputPdf('blob');
}

/**
 * Open PDF in new window for preview
 */
async function previewPDF() {
    const previewElement = document.getElementById('invoicePreview');
    
    if (!previewElement) {
        showToast('Error: Invoice preview not found', 'error');
        return;
    }
    
    try {
        const pdfBlob = await html2pdf()
            .set(PDF_CONFIG)
            .from(previewElement)
            .outputPdf('blob');
        
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        
        // Clean up the URL after a delay
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
    } catch (error) {
        console.error('PDF preview error:', error);
        showToast('Failed to preview PDF. Please try again.', 'error');
    }
}

/**
 * Export invoice data as JSON
 */
function exportInvoiceJSON() {
    const invoiceData = getInvoiceData();
    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceData.invoiceNumber || 'invoice'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Invoice data exported!', 'success');
}

/**
 * Import invoice from JSON file
 */
function importInvoiceJSON(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const invoiceData = JSON.parse(e.target.result);
            loadInvoice(invoiceData);
            showToast('Invoice imported successfully!', 'success');
        } catch (error) {
            console.error('Import error:', error);
            showToast('Invalid invoice file', 'error');
        }
    };
    
    reader.onerror = () => {
        showToast('Failed to read file', 'error');
    };
    
    reader.readAsText(file);
}

// Add CSS for spinner animation
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spinner {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(spinnerStyle);
