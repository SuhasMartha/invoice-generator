/**
 * Invoice Generator - Template Module
 * Contains multiple customizable invoice templates
 */

// Template registry
const TEMPLATES = {
    modern: modernTemplate,
    classic: classicTemplate,
    minimal: minimalTemplate,
    corporate: corporateTemplate
};

/**
 * Modern Template - Clean and contemporary design
 */
function modernTemplate(data, formatCurrency) {
    const accentColor = data.accentColor || '#4F46E5';
    const t = data.translations || {};
    const isRTL = data.language === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';
    
    return `
        <div class="invoice-preview-content" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 40px; color: #1F2937; direction: ${dir};">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                <div>
                    ${data.businessLogo ? `
                        <img src="${escapeHtml(data.businessLogo)}" alt="Logo" style="max-height: 60px; max-width: 200px; margin-bottom: 12px;">
                    ` : `
                        <div style="font-size: 24px; font-weight: 700; color: ${accentColor}; margin-bottom: 8px;">
                            ${escapeHtml(data.businessName) || 'Your Company'}
                        </div>
                    `}
                    <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">
                        ${escapeHtml(data.businessAddress) || ''}
                    </div>
                    ${data.businessEmail ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.businessEmail)}</div>` : ''}
                    ${data.businessPhone ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.businessPhone)}</div>` : ''}
                </div>
                <div style="text-align: ${isRTL ? 'left' : 'right'};">
                    <div style="font-size: 32px; font-weight: 700; color: ${accentColor}; margin-bottom: 8px;">${t.invoice || 'INVOICE'}</div>
                    <div style="font-size: 14px; color: #6B7280;">#${escapeHtml(data.invoiceNumber) || '---'}</div>
                </div>
            </div>
            
            <!-- Dates & Client Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
                <div>
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9CA3AF; margin-bottom: 8px;">${t.billTo || 'Bill To'}</div>
                    <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${escapeHtml(data.clientName) || 'Client Name'}</div>
                    <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">
                        ${escapeHtml(data.clientAddress) || ''}
                    </div>
                    ${data.clientEmail ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.clientEmail)}</div>` : ''}
                    ${data.clientPhone ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.clientPhone)}</div>` : ''}
                </div>
                <div style="text-align: ${isRTL ? 'left' : 'right'};">
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9CA3AF;">${t.invoiceDate || 'Invoice Date'}</div>
                        <div style="font-size: 14px; font-weight: 500;">${formatDisplayDate(data.invoiceDate, data.locale)}</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9CA3AF;">${t.dueDate || 'Due Date'}</div>
                        <div style="font-size: 14px; font-weight: 500;">${formatDisplayDate(data.dueDate, data.locale)}</div>
                    </div>
                </div>
            </div>
            
            <!-- Items Table -->
            <div style="margin-bottom: 32px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: ${accentColor}; color: white;">
                            <th style="padding: 12px 16px; text-align: ${isRTL ? 'right' : 'left'}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">${t.description || 'Description'}</th>
                            <th style="padding: 12px 16px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 80px;">${t.quantity || 'Qty'}</th>
                            <th style="padding: 12px 16px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 120px;">${t.price || 'Price'}</th>
                            <th style="padding: 12px 16px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 120px;">${t.amount || 'Total'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(data.items || []).map((item, index) => `
                            <tr style="border-bottom: 1px solid #E5E7EB; ${index % 2 === 1 ? 'background: #F9FAFB;' : ''}">
                                <td style="padding: 14px 16px; font-size: 14px;">${escapeHtml(item.description) || 'Item description'}</td>
                                <td style="padding: 14px 16px; text-align: center; font-size: 14px;">${item.quantity || 0}</td>
                                <td style="padding: 14px 16px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px;">${formatCurrency(item.price || 0, data.currency)}</td>
                                <td style="padding: 14px 16px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px; font-weight: 500;">${formatCurrency((item.quantity || 0) * (item.price || 0), data.currency)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Totals -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
                <div style="width: 280px;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                        <span style="color: #6B7280;">${t.subtotal || 'Subtotal'}</span>
                        <span style="font-weight: 500;">${formatCurrency(data.subtotal, data.currency)}</span>
                    </div>
                    ${data.discount > 0 ? `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB; color: #10B981;">
                            <span>${t.discount || 'Discount'} ${data.discountType === 'percentage' ? `(${data.discountValue}%)` : ''}</span>
                            <span>-${formatCurrency(data.discount, data.currency)}</span>
                        </div>
                    ` : ''}
                    ${data.tax > 0 ? `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                            <span style="color: #6B7280;">${escapeHtml(data.taxName) || t.tax || 'Tax'} (${data.taxRate}%)</span>
                            <span style="font-weight: 500;">${formatCurrency(data.tax, data.currency)}</span>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; background: ${accentColor}; color: white; margin-top: 8px; padding: 12px; border-radius: 6px;">
                        <span style="font-weight: 600;">${t.totalDue || 'Total Due'}</span>
                        <span style="font-size: 18px; font-weight: 700;">${formatCurrency(data.total, data.currency)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Notes & Payment Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
                ${data.notes ? `
                    <div>
                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9CA3AF; margin-bottom: 8px;">${t.notes || 'Notes'}</div>
                        <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.notes)}</div>
                    </div>
                ` : '<div></div>'}
                ${data.paymentInfo ? `
                    <div>
                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9CA3AF; margin-bottom: 8px;">${t.paymentInfo || 'Payment Information'}</div>
                        <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.paymentInfo)}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Classic Template - Traditional professional look
 */
function classicTemplate(data, formatCurrency) {
    const accentColor = data.accentColor || '#4F46E5';
    const t = data.translations || {};
    const isRTL = data.language === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';
    
    return `
        <div class="invoice-preview-content" style="font-family: 'Georgia', 'Times New Roman', serif; padding: 40px; color: #1F2937; direction: ${dir};">
            <!-- Header with border -->
            <div style="border-bottom: 3px double ${accentColor}; padding-bottom: 24px; margin-bottom: 32px;">
                <div style="text-align: center;">
                    ${data.businessLogo ? `
                        <img src="${escapeHtml(data.businessLogo)}" alt="Logo" style="max-height: 70px; max-width: 220px; margin-bottom: 16px;">
                    ` : `
                        <div style="font-size: 28px; font-weight: 700; color: ${accentColor}; margin-bottom: 8px; letter-spacing: 0.02em;">
                            ${escapeHtml(data.businessName) || 'Your Company'}
                        </div>
                    `}
                    <div style="font-size: 13px; color: #6B7280;">
                        ${escapeHtml(data.businessAddress)?.replace(/\n/g, ' • ') || ''}
                        ${data.businessPhone ? ` • ${escapeHtml(data.businessPhone)}` : ''}
                        ${data.businessEmail ? ` • ${escapeHtml(data.businessEmail)}` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Invoice Title -->
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 24px; color: ${accentColor}; margin: 0 0 8px 0; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase;">${t.invoice || 'Invoice'}</h1>
                <div style="font-size: 16px; color: #6B7280;">#${escapeHtml(data.invoiceNumber) || '---'}</div>
            </div>
            
            <!-- Client & Dates -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 32px; padding: 20px; background: #F9FAFB; border: 1px solid #E5E7EB;">
                <div>
                    <div style="font-size: 12px; color: #9CA3AF; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">${t.billTo || 'Invoice To'}:</div>
                    <div style="font-weight: 600; font-size: 16px;">${escapeHtml(data.clientName) || 'Client Name'}</div>
                    <div style="font-size: 13px; color: #6B7280; white-space: pre-line; margin-top: 4px;">
                        ${escapeHtml(data.clientAddress) || ''}
                    </div>
                    ${data.clientEmail ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.clientEmail)}</div>` : ''}
                </div>
                <div style="text-align: ${isRTL ? 'left' : 'right'};">
                    <div style="margin-bottom: 8px;">
                        <span style="font-size: 12px; color: #9CA3AF;">${t.date || 'Date'}: </span>
                        <span style="font-size: 14px;">${formatDisplayDate(data.invoiceDate, data.locale)}</span>
                    </div>
                    <div>
                        <span style="font-size: 12px; color: #9CA3AF;">${t.due || 'Due'}: </span>
                        <span style="font-size: 14px;">${formatDisplayDate(data.dueDate, data.locale)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #E5E7EB;">
                <thead>
                    <tr style="background: #F3F4F6;">
                        <th style="padding: 12px; text-align: ${isRTL ? 'right' : 'left'}; border: 1px solid #E5E7EB; font-size: 12px; text-transform: uppercase;">${t.description || 'Description'}</th>
                        <th style="padding: 12px; text-align: center; border: 1px solid #E5E7EB; font-size: 12px; text-transform: uppercase; width: 80px;">${t.quantity || 'Qty'}</th>
                        <th style="padding: 12px; text-align: ${isRTL ? 'left' : 'right'}; border: 1px solid #E5E7EB; font-size: 12px; text-transform: uppercase; width: 110px;">${t.price || 'Rate'}</th>
                        <th style="padding: 12px; text-align: ${isRTL ? 'left' : 'right'}; border: 1px solid #E5E7EB; font-size: 12px; text-transform: uppercase; width: 110px;">${t.amount || 'Amount'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${(data.items || []).map(item => `
                        <tr>
                            <td style="padding: 12px; border: 1px solid #E5E7EB; font-size: 14px;">${escapeHtml(item.description) || 'Item description'}</td>
                            <td style="padding: 12px; text-align: center; border: 1px solid #E5E7EB; font-size: 14px;">${item.quantity || 0}</td>
                            <td style="padding: 12px; text-align: ${isRTL ? 'left' : 'right'}; border: 1px solid #E5E7EB; font-size: 14px;">${formatCurrency(item.price || 0, data.currency)}</td>
                            <td style="padding: 12px; text-align: ${isRTL ? 'left' : 'right'}; border: 1px solid #E5E7EB; font-size: 14px;">${formatCurrency((item.quantity || 0) * (item.price || 0), data.currency)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <!-- Totals -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
                <table style="width: 280px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; text-align: ${isRTL ? 'right' : 'left'}; color: #6B7280;">${t.subtotal || 'Subtotal'}:</td>
                        <td style="padding: 8px; text-align: ${isRTL ? 'left' : 'right'};">${formatCurrency(data.subtotal, data.currency)}</td>
                    </tr>
                    ${data.discount > 0 ? `
                        <tr>
                            <td style="padding: 8px; text-align: ${isRTL ? 'right' : 'left'}; color: #10B981;">${t.discount || 'Discount'}:</td>
                            <td style="padding: 8px; text-align: ${isRTL ? 'left' : 'right'}; color: #10B981;">-${formatCurrency(data.discount, data.currency)}</td>
                        </tr>
                    ` : ''}
                    ${data.tax > 0 ? `
                        <tr>
                            <td style="padding: 8px; text-align: ${isRTL ? 'right' : 'left'}; color: #6B7280;">${escapeHtml(data.taxName) || t.tax || 'Tax'} (${data.taxRate}%):</td>
                            <td style="padding: 8px; text-align: ${isRTL ? 'left' : 'right'};">${formatCurrency(data.tax, data.currency)}</td>
                        </tr>
                    ` : ''}
                    <tr style="border-top: 2px solid ${accentColor};">
                        <td style="padding: 12px 8px; text-align: ${isRTL ? 'right' : 'left'}; font-weight: 700; font-size: 16px;">${t.total || 'Total'}:</td>
                        <td style="padding: 12px 8px; text-align: ${isRTL ? 'left' : 'right'}; font-weight: 700; font-size: 18px; color: ${accentColor};">${formatCurrency(data.total, data.currency)}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #E5E7EB; padding-top: 24px;">
                ${data.notes ? `
                    <div style="margin-bottom: 16px;">
                        <div style="font-weight: 600; margin-bottom: 4px;">${t.notes || 'Notes'}:</div>
                        <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.notes)}</div>
                    </div>
                ` : ''}
                ${data.paymentInfo ? `
                    <div>
                        <div style="font-weight: 600; margin-bottom: 4px;">${t.paymentInfo || 'Payment Details'}:</div>
                        <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.paymentInfo)}</div>
                    </div>
                ` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 3px double ${accentColor};">
                <div style="font-size: 12px; color: #9CA3AF;">${t.thankYou || 'Thank you for your business!'}</div>
            </div>
        </div>
    `;
}

/**
 * Minimal Template - Simple and clean design
 */
function minimalTemplate(data, formatCurrency) {
    const accentColor = data.accentColor || '#4F46E5';
    const t = data.translations || {};
    const isRTL = data.language === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';
    
    return `
        <div class="invoice-preview-content" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 48px; color: #1F2937; direction: ${dir};">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px;">
                <div>
                    ${data.businessLogo ? `
                        <img src="${escapeHtml(data.businessLogo)}" alt="Logo" style="max-height: 40px; max-width: 160px;">
                    ` : `
                        <div style="font-size: 18px; font-weight: 600;">${escapeHtml(data.businessName) || 'Your Company'}</div>
                    `}
                </div>
                <div style="text-align: ${isRTL ? 'left' : 'right'};">
                    <div style="font-size: 12px; color: #9CA3AF; margin-bottom: 2px;">${t.invoice || 'Invoice'}</div>
                    <div style="font-size: 14px; font-weight: 500;">${escapeHtml(data.invoiceNumber) || '---'}</div>
                </div>
            </div>
            
            <!-- Info Grid -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-bottom: 48px;">
                <div>
                    <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">${t.from || 'From'}</div>
                    <div style="font-size: 14px; font-weight: 500; margin-bottom: 4px;">${escapeHtml(data.businessName) || 'Your Company'}</div>
                    <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.businessAddress) || ''}</div>
                    ${data.businessEmail ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.businessEmail)}</div>` : ''}
                </div>
                <div>
                    <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">${t.to || 'To'}</div>
                    <div style="font-size: 14px; font-weight: 500; margin-bottom: 4px;">${escapeHtml(data.clientName) || 'Client Name'}</div>
                    <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.clientAddress) || ''}</div>
                    ${data.clientEmail ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.clientEmail)}</div>` : ''}
                </div>
                <div>
                    <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">${t.details || 'Details'}</div>
                    <div style="font-size: 13px;"><span style="color: #9CA3AF;">${t.date || 'Date'}:</span> ${formatDisplayDate(data.invoiceDate, data.locale)}</div>
                    <div style="font-size: 13px;"><span style="color: #9CA3AF;">${t.due || 'Due'}:</span> ${formatDisplayDate(data.dueDate, data.locale)}</div>
                </div>
            </div>
            
            <!-- Items -->
            <div style="margin-bottom: 32px;">
                ${(data.items || []).map((item, index) => `
                    <div style="display: flex; justify-content: space-between; padding: 16px 0; ${index < (data.items || []).length - 1 ? 'border-bottom: 1px solid #F3F4F6;' : ''}">
                        <div style="flex: 1;">
                            <div style="font-size: 14px; font-weight: 500;">${escapeHtml(item.description) || 'Item'}</div>
                            <div style="font-size: 13px; color: #9CA3AF;">${item.quantity} × ${formatCurrency(item.price || 0, data.currency)}</div>
                        </div>
                        <div style="font-size: 14px; font-weight: 500;">
                            ${formatCurrency((item.quantity || 0) * (item.price || 0), data.currency)}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Totals -->
            <div style="border-top: 2px solid #1F2937; padding-top: 16px; margin-bottom: 48px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6B7280;">${t.subtotal || 'Subtotal'}</span>
                    <span>${formatCurrency(data.subtotal, data.currency)}</span>
                </div>
                ${data.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #10B981;">
                        <span>${t.discount || 'Discount'}</span>
                        <span>-${formatCurrency(data.discount, data.currency)}</span>
                    </div>
                ` : ''}
                ${data.tax > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #6B7280;">${escapeHtml(data.taxName) || t.tax || 'Tax'} (${data.taxRate}%)</span>
                        <span>${formatCurrency(data.tax, data.currency)}</span>
                    </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; margin-top: 16px;">
                    <span>${t.total || 'Total'}</span>
                    <span style="color: ${accentColor};">${formatCurrency(data.total, data.currency)}</span>
                </div>
            </div>
            
            <!-- Notes -->
            ${data.notes || data.paymentInfo ? `
                <div style="font-size: 13px; color: #6B7280;">
                    ${data.notes ? `<p style="margin: 0 0 8px 0; white-space: pre-line;">${escapeHtml(data.notes)}</p>` : ''}
                    ${data.paymentInfo ? `<p style="margin: 0; white-space: pre-line;">${escapeHtml(data.paymentInfo)}</p>` : ''}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Corporate Template - Professional business style
 */
function corporateTemplate(data, formatCurrency) {
    const accentColor = data.accentColor || '#4F46E5';
    const t = data.translations || {};
    const isRTL = data.language === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';
    
    return `
        <div class="invoice-preview-content" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 0; color: #1F2937; direction: ${dir};">
            <!-- Colored Header -->
            <div style="background: ${accentColor}; color: white; padding: 32px 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        ${data.businessLogo ? `
                            <img src="${escapeHtml(data.businessLogo)}" alt="Logo" style="max-height: 50px; max-width: 180px; filter: brightness(0) invert(1);">
                        ` : `
                            <div style="font-size: 22px; font-weight: 700;">${escapeHtml(data.businessName) || 'Your Company'}</div>
                        `}
                    </div>
                    <div style="text-align: ${isRTL ? 'left' : 'right'};">
                        <div style="font-size: 28px; font-weight: 700; letter-spacing: 0.05em;">${t.invoice || 'INVOICE'}</div>
                        <div style="font-size: 14px; opacity: 0.9;">#${escapeHtml(data.invoiceNumber) || '---'}</div>
                    </div>
                </div>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px;">
                <!-- Addresses & Dates -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; margin-bottom: 40px;">
                    <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${accentColor}; font-weight: 600; margin-bottom: 12px;">${t.from || 'From'}</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(data.businessName) || 'Your Company'}</div>
                        <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.businessAddress) || ''}</div>
                        ${data.businessPhone ? `<div style="font-size: 13px; color: #6B7280; margin-top: 4px;">${escapeHtml(data.businessPhone)}</div>` : ''}
                        ${data.businessEmail ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.businessEmail)}</div>` : ''}
                    </div>
                    <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${accentColor}; font-weight: 600; margin-bottom: 12px;">${t.billTo || 'Bill To'}</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(data.clientName) || 'Client Name'}</div>
                        <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.clientAddress) || ''}</div>
                        ${data.clientPhone ? `<div style="font-size: 13px; color: #6B7280; margin-top: 4px;">${escapeHtml(data.clientPhone)}</div>` : ''}
                        ${data.clientEmail ? `<div style="font-size: 13px; color: #6B7280;">${escapeHtml(data.clientEmail)}</div>` : ''}
                    </div>
                    <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${accentColor}; font-weight: 600; margin-bottom: 12px;">${t.details || 'Invoice Details'}</div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 13px; color: #6B7280;">${t.invoiceDate || 'Invoice Date'}:</span>
                            <span style="font-size: 13px; font-weight: 500;">${formatDisplayDate(data.invoiceDate, data.locale)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 13px; color: #6B7280;">${t.dueDate || 'Due Date'}:</span>
                            <span style="font-size: 13px; font-weight: 500;">${formatDisplayDate(data.dueDate, data.locale)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 13px; color: #6B7280;">Currency:</span>
                            <span style="font-size: 13px; font-weight: 500;">${data.currency}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Items Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                    <thead>
                        <tr>
                            <th style="padding: 14px 16px; text-align: ${isRTL ? 'right' : 'left'}; background: ${accentColor}; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; border-radius: 6px 0 0 0;">${t.itemDescription || 'Item Description'}</th>
                            <th style="padding: 14px 16px; text-align: center; background: ${accentColor}; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 80px;">${t.quantity || 'Qty'}</th>
                            <th style="padding: 14px 16px; text-align: ${isRTL ? 'left' : 'right'}; background: ${accentColor}; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 110px;">${t.unitPrice || 'Unit Price'}</th>
                            <th style="padding: 14px 16px; text-align: ${isRTL ? 'left' : 'right'}; background: ${accentColor}; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; width: 120px; border-radius: 0 6px 0 0;">${t.amount || 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(data.items || []).map((item, index) => `
                            <tr style="background: ${index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'};">
                                <td style="padding: 14px 16px; font-size: 14px; border-bottom: 1px solid #E5E7EB;">${escapeHtml(item.description) || 'Item description'}</td>
                                <td style="padding: 14px 16px; text-align: center; font-size: 14px; border-bottom: 1px solid #E5E7EB;">${item.quantity || 0}</td>
                                <td style="padding: 14px 16px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px; border-bottom: 1px solid #E5E7EB;">${formatCurrency(item.price || 0, data.currency)}</td>
                                <td style="padding: 14px 16px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px; font-weight: 600; border-bottom: 1px solid #E5E7EB;">${formatCurrency((item.quantity || 0) * (item.price || 0), data.currency)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <!-- Totals Box -->
                <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
                    <div style="width: 300px; background: #F9FAFB; border-radius: 8px; padding: 20px;">
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                            <span style="color: #6B7280;">${t.subtotal || 'Subtotal'}</span>
                            <span style="font-weight: 500;">${formatCurrency(data.subtotal, data.currency)}</span>
                        </div>
                        ${data.discount > 0 ? `
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #10B981;">${t.discount || 'Discount'} ${data.discountType === 'percentage' ? `(${data.discountValue}%)` : ''}</span>
                                <span style="color: #10B981;">-${formatCurrency(data.discount, data.currency)}</span>
                            </div>
                        ` : ''}
                        ${data.tax > 0 ? `
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280;">${escapeHtml(data.taxName) || t.tax || 'Tax'} (${data.taxRate}%)</span>
                                <span style="font-weight: 500;">${formatCurrency(data.tax, data.currency)}</span>
                            </div>
                        ` : ''}
                        <div style="display: flex; justify-content: space-between; padding: 16px 0 8px 0;">
                            <span style="font-size: 16px; font-weight: 700;">${t.totalDue || 'Total Due'}</span>
                            <span style="font-size: 20px; font-weight: 700; color: ${accentColor};">${formatCurrency(data.total, data.currency)}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                ${data.notes || data.paymentInfo ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB;">
                        ${data.notes ? `
                            <div>
                                <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${accentColor}; font-weight: 600; margin-bottom: 8px;">${t.terms || 'Terms & Notes'}</div>
                                <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.notes)}</div>
                            </div>
                        ` : '<div></div>'}
                        ${data.paymentInfo ? `
                            <div>
                                <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${accentColor}; font-weight: 600; margin-bottom: 8px;">${t.paymentInfo || 'Payment Information'}</div>
                                <div style="font-size: 13px; color: #6B7280; white-space: pre-line;">${escapeHtml(data.paymentInfo)}</div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
            
            <!-- Footer Bar -->
            <div style="background: ${accentColor}; color: white; padding: 16px 40px; text-align: center; font-size: 12px;">
                ${t.thankYou || 'Thank you for your business!'}
            </div>
        </div>
    `;
}

/**
 * Helper function to format date for display
 */
function formatDisplayDate(dateString, locale = 'en-US') {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Escape HTML helper (duplicate for template module independence)
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
