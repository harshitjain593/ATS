import { Offer } from '@/lib/types'

export const generateOfferLetterPDF = (offer: Offer): void => {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to generate the offer letter PDF')
    return
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offer Letter - ${offer.candidateName}</title>
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #2c3e50;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .company-address {
          font-size: 14px;
          color: #666;
        }
        
        .date {
          text-align: right;
          margin-bottom: 30px;
          font-size: 14px;
        }
        
        .candidate-info {
          margin-bottom: 30px;
        }
        
        .candidate-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .candidate-address {
          font-size: 14px;
          line-height: 1.4;
        }
        
        .subject {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        
        .content {
          font-size: 14px;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 15px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        
        .detail-label {
          font-weight: bold;
          color: #555;
        }
        
        .detail-value {
          color: #333;
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
        }
        
        .benefits-list li {
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        
        .benefits-list li:before {
          content: "✓ ";
          color: #27ae60;
          font-weight: bold;
        }
        
        .terms-section {
          background: #f8f9fa;
          padding: 20px;
          border-left: 4px solid #3498db;
          margin: 20px 0;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        
        .signature-section {
          margin-top: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        
        .signature-box {
          border-top: 1px solid #333;
          padding-top: 10px;
          text-align: center;
        }
        
        .signature-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .signature-title {
          font-size: 12px;
          color: #666;
        }
        
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .print-button:hover {
          background: #2980b9;
        }
      </style>
    </head>
    <body>
      <button class="print-button no-print" onclick="window.print()">Print/Save PDF</button>
      
      <div class="header">
        <div class="company-name">${offer.companyName || 'Company Name'}</div>
        <div class="company-address">
          ${offer.location || 'Company Address'}<br>
          ${offer.contactEmail || 'contact@company.com'} | ${offer.contactPhone || 'Phone Number'}
        </div>
      </div>
      
      <div class="date">
        ${formatDate(offer.createdDate)}
      </div>
      
      <div class="candidate-info">
        <div class="candidate-name">${offer.candidateName || 'Candidate Name'}</div>
        <div class="candidate-address">
          ${offer.candidateEmail || 'candidate@email.com'}<br>
          ${offer.candidatePhone || 'Phone Number'}<br>
          ${offer.candidateAddress || 'Address'}
        </div>
      </div>
      
      <div class="subject">
        RE: Offer of Employment - ${offer.jobTitle || 'Position Title'}
      </div>
      
      <div class="content">
        Dear ${offer.candidateName || 'Candidate Name'},
        <br><br>
        We are pleased to extend you an offer of employment for the position of <strong>${offer.jobTitle || 'Position Title'}</strong> at ${offer.companyName || 'Company Name'}. This offer is contingent upon your acceptance of the terms and conditions outlined below.
      </div>
      
      <div class="section">
        <div class="section-title">Position Details</div>
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Position:</span>
            <span class="detail-value">${offer.jobTitle || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Department:</span>
            <span class="detail-value">${offer.department || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${offer.location || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Employment Type:</span>
            <span class="detail-value">${offer.jobType || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Reporting To:</span>
            <span class="detail-value">${offer.reportingTo || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Start Date:</span>
            <span class="detail-value">${formatDate(offer.startDate)}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Compensation & Benefits</div>
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Base Salary:</span>
            <span class="detail-value">${formatCurrency(offer.baseSalary)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Bonus:</span>
            <span class="detail-value">${formatCurrency(offer.bonus)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Equity:</span>
            <span class="detail-value">${offer.equity || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Work Schedule:</span>
            <span class="detail-value">${offer.workSchedule || 'N/A'}</span>
          </div>
        </div>
        
        ${offer.benefits && offer.benefits.length > 0 ? `
        <div class="section-title">Benefits Package</div>
        <ul class="benefits-list">
          ${offer.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
        ` : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Employment Terms</div>
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Probation Period:</span>
            <span class="detail-value">${offer.probationPeriod || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Notice Period:</span>
            <span class="detail-value">${offer.noticePeriod || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Offer Expiry:</span>
            <span class="detail-value">${formatDate(offer.offerExpiryDate)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Acceptance Deadline:</span>
            <span class="detail-value">${formatDate(offer.acceptanceDeadline)}</span>
          </div>
        </div>
      </div>
      
      ${offer.termsAndConditions && offer.termsAndConditions.length > 0 ? `
      <div class="terms-section">
        <div class="section-title">Terms and Conditions</div>
        <ul>
          ${offer.termsAndConditions.map(term => `<li>${term}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${offer.terminationClause ? `
      <div class="section">
        <div class="section-title">Termination Clause</div>
        <div class="content">${offer.terminationClause}</div>
      </div>
      ` : ''}
      
      ${offer.confidentialityClause ? `
      <div class="section">
        <div class="section-title">Confidentiality Clause</div>
        <div class="content">${offer.confidentialityClause}</div>
      </div>
      ` : ''}
      
      ${offer.nonCompeteClause ? `
      <div class="section">
        <div class="section-title">Non-Compete Clause</div>
        <div class="content">${offer.nonCompeteClause}</div>
      </div>
      ` : ''}
      
      ${offer.intellectualPropertyClause ? `
      <div class="section">
        <div class="section-title">Intellectual Property Clause</div>
        <div class="content">${offer.intellectualPropertyClause}</div>
      </div>
      ` : ''}
      
      <div class="content">
        We look forward to having you join our team. Please review this offer carefully and contact us if you have any questions.
        <br><br>
        Sincerely,
      </div>
      
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-name">${offer.contactPerson || 'HR Representative'}</div>
          <div class="signature-title">${offer.contactPerson ? 'Human Resources' : 'HR Department'}</div>
        </div>
        <div class="signature-box">
          <div class="signature-name">${offer.candidateName || 'Candidate Name'}</div>
          <div class="signature-title">Candidate Signature</div>
        </div>
      </div>
      
      <div class="footer">
        <strong>Contact Information:</strong><br>
        ${offer.contactPerson || 'HR Department'}<br>
        ${offer.contactEmail || 'hr@company.com'}<br>
        ${offer.contactPhone || 'Phone Number'}<br>
        ${offer.companyName || 'Company Name'}<br>
        ${offer.location || 'Company Address'}
      </div>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
  
  // Auto-print after a short delay
  setTimeout(() => {
    printWindow.print()
  }, 500)
} 