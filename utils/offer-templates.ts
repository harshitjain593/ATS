import { Offer } from '@/lib/types'

export interface OfferTemplate {
  id: string
  name: string
  description: string
  category: 'formal' | 'modern' | 'startup'
  generateHTML: (offer: Offer) => string
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

const safeArray = (value: any): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    // Handle comma-separated strings
    return value.split(',').map(item => item.trim()).filter(item => item)
  }
  return []
}

// Template 1: Formal Corporate Style
export const formalTemplate: OfferTemplate = {
  id: 'formal',
  name: 'Formal Corporate',
  description: 'Traditional corporate style with formal language and structured layout',
  category: 'formal',
  generateHTML: (offer: Offer) => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offer Letter - ${offer.candidateName}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #2c3e50; max-width: 800px; margin: 0 auto; padding: 40px; }
        .header { text-align: center; border-bottom: 3px solid #34495e; padding-bottom: 25px; margin-bottom: 35px; }
        .company-name { font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; }
        .company-address { font-size: 14px; color: #7f8c8d; line-height: 1.4; }
        .date { text-align: right; margin-bottom: 35px; font-size: 14px; color: #7f8c8d; }
        .candidate-info { margin-bottom: 35px; border-left: 4px solid #3498db; padding-left: 20px; }
        .candidate-name { font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #2c3e50; }
        .candidate-address { font-size: 14px; line-height: 1.5; color: #7f8c8d; }
        .subject { font-size: 18px; font-weight: bold; margin-bottom: 25px; color: #2c3e50; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
        .content { font-size: 14px; line-height: 1.8; margin-bottom: 35px; text-align: justify; }
        .section { margin-bottom: 30px; border: 1px solid #ecf0f1; padding: 20px; border-radius: 5px; }
        .section-title { font-weight: bold; color: #2c3e50; margin-bottom: 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #3498db; padding-bottom: 8px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ecf0f1; }
        .detail-label { font-weight: bold; color: #34495e; }
        .detail-value { color: #2c3e50; }
        .benefits-list { list-style: none; padding: 0; }
        .benefits-list li { padding: 8px 0; border-bottom: 1px solid #ecf0f1; position: relative; padding-left: 25px; }
        .benefits-list li:before { content: "✓"; position: absolute; left: 0; color: #27ae60; font-weight: bold; font-size: 16px; }
        .terms-section { background: #f8f9fa; padding: 25px; border-left: 5px solid #3498db; margin: 25px 0; border-radius: 5px; }
        .footer { margin-top: 50px; padding-top: 25px; border-top: 2px solid #ecf0f1; font-size: 12px; color: #7f8c8d; text-align: center; }
        .signature-section { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
        .signature-box { border-top: 2px solid #2c3e50; padding-top: 15px; text-align: center; }
        .signature-name { font-weight: bold; margin-bottom: 8px; color: #2c3e50; }
        .signature-title { font-size: 12px; color: #7f8c8d; }
        .print-button { position: fixed; top: 20px; right: 20px; background: #3498db; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold; }
        @media print { body { margin: 0; } .no-print { display: none; } }
      </style>
    </head>
    <body>
      <button class="print-button no-print" onclick="window.print()">Print/Save PDF</button>
      
      <div class="header">
        <div class="company-name">${offer.companyName || 'COMPANY NAME'}</div>
        <div class="company-address">
          ${offer.location || 'Company Address'}<br>
          ${offer.contactEmail || 'contact@company.com'} | ${offer.contactPhone || 'Phone Number'}
        </div>
      </div>
      
      <div class="date">${formatDate(offer.createdDate)}</div>
      
      <div class="candidate-info">
        <div class="candidate-name">${offer.candidateName || 'Candidate Name'}</div>
        <div class="candidate-address">
          ${offer.candidateEmail || 'candidate@email.com'}<br>
          ${offer.candidatePhone || 'Phone Number'}<br>
          ${offer.candidateAddress || 'Address'}
        </div>
      </div>
      
      <div class="subject">RE: Offer of Employment - ${offer.jobTitle || 'Position Title'}</div>
      
      <div class="content">
        Dear ${offer.candidateName || 'Candidate Name'},
        <br><br>
        We are pleased to extend you an offer of employment for the position of <strong>${offer.jobTitle || 'Position Title'}</strong> at ${offer.companyName || 'Company Name'}. This offer is contingent upon your acceptance of the terms and conditions outlined below.
        <br><br>
        We believe your skills and experience will be a valuable addition to our team, and we look forward to the opportunity to work together.
      </div>
      
      <div class="section">
        <div class="section-title">Position Details</div>
        <div class="details-grid">
          <div class="detail-item"><span class="detail-label">Position:</span><span class="detail-value">${offer.jobTitle || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Department:</span><span class="detail-value">${offer.department || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Location:</span><span class="detail-value">${offer.location || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Employment Type:</span><span class="detail-value">${offer.jobType || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Reporting To:</span><span class="detail-value">${offer.reportingTo || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Start Date:</span><span class="detail-value">${formatDate(offer.startDate)}</span></div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Compensation & Benefits</div>
        <div class="details-grid">
          <div class="detail-item"><span class="detail-label">Base Salary:</span><span class="detail-value">${formatCurrency(offer.baseSalary)}</span></div>
          <div class="detail-item"><span class="detail-label">Bonus:</span><span class="detail-value">${formatCurrency(offer.bonus)}</span></div>
          <div class="detail-item"><span class="detail-label">Equity:</span><span class="detail-value">${offer.equity || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Work Schedule:</span><span class="detail-value">${offer.workSchedule || 'N/A'}</span></div>
        </div>
        
        ${safeArray(offer.benefits).length > 0 ? `
        <div class="section-title">Benefits Package</div>
        <ul class="benefits-list">
          ${safeArray(offer.benefits).map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
        ` : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Employment Terms</div>
        <div class="details-grid">
          <div class="detail-item"><span class="detail-label">Probation Period:</span><span class="detail-value">${offer.probationPeriod || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Notice Period:</span><span class="detail-value">${offer.noticePeriod || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Offer Expiry:</span><span class="detail-value">${formatDate(offer.offerExpiryDate)}</span></div>
          <div class="detail-item"><span class="detail-label">Acceptance Deadline:</span><span class="detail-value">${formatDate(offer.acceptanceDeadline)}</span></div>
        </div>
      </div>
      
      ${offer.termsAndConditions && Array.isArray(offer.termsAndConditions) && offer.termsAndConditions.length > 0 ? `
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
}

// Template 2: Modern Startup Style
export const modernTemplate: OfferTemplate = {
  id: 'modern',
  name: 'Modern Startup',
  description: 'Clean, modern design with contemporary language and layout',
  category: 'modern',
  generateHTML: (offer: Offer) => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offer Letter - ${offer.candidateName}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; background: white; }
        .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; border-radius: 15px; margin-bottom: 40px; }
        .company-name { font-size: 32px; font-weight: 300; margin-bottom: 10px; }
        .company-address { font-size: 16px; opacity: 0.9; }
        .date { text-align: right; margin-bottom: 30px; font-size: 14px; color: #666; }
        .candidate-info { background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 30px; border-left: 5px solid #667eea; }
        .candidate-name { font-size: 24px; font-weight: 600; margin-bottom: 10px; color: #333; }
        .candidate-address { font-size: 14px; line-height: 1.5; color: #666; }
        .subject { font-size: 20px; font-weight: 600; margin-bottom: 25px; color: #333; text-align: center; }
        .content { font-size: 16px; line-height: 1.7; margin-bottom: 30px; }
        .section { margin-bottom: 25px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .section-title { background: #667eea; color: white; padding: 15px 20px; font-weight: 600; font-size: 16px; }
        .section-content { padding: 20px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .detail-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .detail-item:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #555; }
        .detail-value { color: #333; }
        .benefits-list { list-style: none; padding: 0; }
        .benefits-list li { padding: 10px 0; border-bottom: 1px solid #eee; position: relative; padding-left: 30px; }
        .benefits-list li:last-child { border-bottom: none; }
        .benefits-list li:before { content: "🎉"; position: absolute; left: 0; font-size: 16px; }
        .terms-section { background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #2196f3; }
        .footer { margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 10px; font-size: 14px; color: #666; text-align: center; }
        .signature-section { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .signature-box { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px; }
        .signature-line { border-top: 2px solid #667eea; margin-top: 15px; padding-top: 15px; }
        .signature-name { font-weight: 600; margin-bottom: 5px; color: #333; }
        .signature-title { font-size: 12px; color: #666; }
        .print-button { position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
        @media print { body { margin: 0; } .no-print { display: none; } }
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
      
      <div class="date">${formatDate(offer.createdDate)}</div>
      
      <div class="candidate-info">
        <div class="candidate-name">${offer.candidateName || 'Candidate Name'}</div>
        <div class="candidate-address">
          ${offer.candidateEmail || 'candidate@email.com'}<br>
          ${offer.candidatePhone || 'Phone Number'}<br>
          ${offer.candidateAddress || 'Address'}
        </div>
      </div>
      
      <div class="subject">🎉 Welcome to the Team! - ${offer.jobTitle || 'Position Title'}</div>
      
      <div class="content">
        Hi ${offer.candidateName || 'there'}! 👋
        <br><br>
        We're super excited to offer you the position of <strong>${offer.jobTitle || 'Position Title'}</strong> at ${offer.companyName || 'Company Name'}! We were really impressed by your skills and think you'll be a perfect fit for our team.
        <br><br>
        Here's what we're offering you:
      </div>
      
      <div class="section">
        <div class="section-title">📋 Position Details</div>
        <div class="section-content">
          <div class="details-grid">
            <div class="detail-item"><span class="detail-label">Position:</span><span class="detail-value">${offer.jobTitle || 'N/A'}</span></div>
            <div class="detail-item"><span class="detail-label">Department:</span><span class="detail-value">${offer.department || 'N/A'}</span></div>
            <div class="detail-item"><span class="detail-label">Location:</span><span class="detail-value">${offer.location || 'N/A'}</span></div>
            <div class="detail-item"><span class="detail-label">Employment Type:</span><span class="detail-value">${offer.jobType || 'N/A'}</span></div>
            <div class="detail-item"><span class="detail-label">Reporting To:</span><span class="detail-value">${offer.reportingTo || 'N/A'}</span></div>
            <div class="detail-item"><span class="detail-label">Start Date:</span><span class="detail-value">${formatDate(offer.startDate)}</span></div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">💰 Compensation & Benefits</div>
        <div class="section-content">
          <div class="details-grid">
            <div class="detail-item"><span class="detail-label">Base Salary:</span><span class="detail-value">${formatCurrency(offer.baseSalary)}</span></div>
            <div class="detail-item"><span class="detail-label">Bonus:</span><span class="detail-value">${formatCurrency(offer.bonus)}</span></div>
            <div class="detail-item"><span class="detail-label">Equity:</span><span class="detail-value">${offer.equity || 'N/A'}</span></div>
            <div class="detail-item"><span class="detail-label">Work Schedule:</span><span class="detail-value">${offer.workSchedule || 'N/A'}</span></div>
          </div>
          
          ${safeArray(offer.benefits).length > 0 ? `
          <div style="margin-top: 20px;">
            <h4 style="color: #667eea; margin-bottom: 15px;">🎁 Benefits Package</h4>
            <ul class="benefits-list">
              ${safeArray(offer.benefits).map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">📅 Employment Terms</div>
        <div class="section-content">
          <div class="details-grid">
            <div class="detail-item"><span class="detail-label">Probation Period:</span><span class="detail-value">${offer.probationPeriod || 'N/A'}</span></div>
            <div class="detail-item"><span class="detail-label">Notice Period:</span><span class="detail-value">${offer.noticePeriod || 'N/A'}</span></div>
            <div class="detail-item"><span class="detail-label">Offer Expiry:</span><span class="detail-value">${formatDate(offer.offerExpiryDate)}</span></div>
            <div class="detail-item"><span class="detail-label">Acceptance Deadline:</span><span class="detail-value">${formatDate(offer.acceptanceDeadline)}</span></div>
          </div>
        </div>
      </div>
      
      ${safeArray(offer.termsAndConditions).length > 0 ? `
      <div class="terms-section">
        <h4 style="color: #2196f3; margin-bottom: 15px;">📋 Terms and Conditions</h4>
        <ul>
          ${safeArray(offer.termsAndConditions).map(term => `<li>${term}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${offer.terminationClause ? `
      <div class="section">
        <div class="section-title">⚠️ Termination Clause</div>
        <div class="section-content">
          <div class="content">${offer.terminationClause}</div>
        </div>
      </div>
      ` : ''}
      
      ${offer.confidentialityClause ? `
      <div class="section">
        <div class="section-title">🔒 Confidentiality Clause</div>
        <div class="section-content">
          <div class="content">${offer.confidentialityClause}</div>
        </div>
      </div>
      ` : ''}
      
      ${offer.nonCompeteClause ? `
      <div class="section">
        <div class="section-title">🚫 Non-Compete Clause</div>
        <div class="section-content">
          <div class="content">${offer.nonCompeteClause}</div>
        </div>
      </div>
      ` : ''}
      
      ${offer.intellectualPropertyClause ? `
      <div class="section">
        <div class="section-title">💡 Intellectual Property Clause</div>
        <div class="section-content">
          <div class="content">${offer.intellectualPropertyClause}</div>
        </div>
      </div>
      ` : ''}
      
      <div class="content">
        We can't wait to have you on board! 🚀 Please review this offer and let us know if you have any questions.
        <br><br>
        Best regards,
      </div>
      
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-name">${offer.contactPerson || 'HR Team'}</div>
          <div class="signature-title">${offer.contactPerson ? 'Human Resources' : 'HR Department'}</div>
          <div class="signature-line"></div>
        </div>
        <div class="signature-box">
          <div class="signature-name">${offer.candidateName || 'Candidate Name'}</div>
          <div class="signature-title">Candidate Signature</div>
          <div class="signature-line"></div>
        </div>
      </div>
      
      <div class="footer">
        <strong>📞 Contact Information:</strong><br>
        ${offer.contactPerson || 'HR Team'}<br>
        ${offer.contactEmail || 'hr@company.com'}<br>
        ${offer.contactPhone || 'Phone Number'}<br>
        ${offer.companyName || 'Company Name'}<br>
        ${offer.location || 'Company Address'}
      </div>
    </body>
    </html>
  `
}

// Template 3: Minimalist Professional Style
export const minimalistTemplate: OfferTemplate = {
  id: 'minimalist',
  name: 'Minimalist Professional',
  description: 'Clean, minimalist design with focus on content and readability',
  category: 'startup',
  generateHTML: (offer: Offer) => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offer Letter - ${offer.candidateName}</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 700px; margin: 0 auto; padding: 60px 40px; background: white; }
        .header { text-align: center; margin-bottom: 50px; }
        .company-name { font-size: 36px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; letter-spacing: -0.5px; }
        .company-address { font-size: 16px; color: #666; font-weight: 400; }
        .date { text-align: right; margin-bottom: 40px; font-size: 14px; color: #666; }
        .candidate-info { margin-bottom: 40px; }
        .candidate-name { font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #1a1a1a; }
        .candidate-address { font-size: 16px; line-height: 1.5; color: #666; }
        .subject { font-size: 20px; font-weight: 600; margin-bottom: 30px; color: #1a1a1a; text-align: center; }
        .content { font-size: 16px; line-height: 1.7; margin-bottom: 40px; color: #333; }
        .section { margin-bottom: 35px; }
        .section-title { font-weight: 600; color: #1a1a1a; margin-bottom: 20px; font-size: 18px; border-bottom: 2px solid #e5e5e5; padding-bottom: 8px; }
        .details-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .detail-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
        .detail-item:last-child { border-bottom: none; }
        .detail-label { font-weight: 500; color: #666; min-width: 140px; }
        .detail-value { color: #1a1a1a; font-weight: 500; }
        .benefits-list { list-style: none; padding: 0; }
        .benefits-list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; position: relative; padding-left: 24px; }
        .benefits-list li:last-child { border-bottom: none; }
        .benefits-list li:before { content: "•"; position: absolute; left: 0; color: #1a1a1a; font-weight: bold; font-size: 18px; }
        .terms-section { background: #fafafa; padding: 25px; border-radius: 8px; margin: 25px 0; }
        .footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #e5e5e5; font-size: 14px; color: #666; text-align: center; }
        .signature-section { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .signature-box { text-align: center; }
        .signature-line { border-top: 1px solid #1a1a1a; margin-top: 20px; padding-top: 15px; }
        .signature-name { font-weight: 600; margin-bottom: 5px; color: #1a1a1a; }
        .signature-title { font-size: 12px; color: #666; }
        .print-button { position: fixed; top: 20px; right: 20px; background: #1a1a1a; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; }
        @media print { body { margin: 0; } .no-print { display: none; } }
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
      
      <div class="date">${formatDate(offer.createdDate)}</div>
      
      <div class="candidate-info">
        <div class="candidate-name">${offer.candidateName || 'Candidate Name'}</div>
        <div class="candidate-address">
          ${offer.candidateEmail || 'candidate@email.com'}<br>
          ${offer.candidatePhone || 'Phone Number'}<br>
          ${offer.candidateAddress || 'Address'}
        </div>
      </div>
      
      <div class="subject">Offer of Employment - ${offer.jobTitle || 'Position Title'}</div>
      
      <div class="content">
        Dear ${offer.candidateName || 'Candidate Name'},
        <br><br>
        We are pleased to offer you the position of <strong>${offer.jobTitle || 'Position Title'}</strong> at ${offer.companyName || 'Company Name'}. This offer is contingent upon your acceptance of the terms outlined below.
      </div>
      
      <div class="section">
        <div class="section-title">Position Details</div>
        <div class="details-grid">
          <div class="detail-item"><span class="detail-label">Position</span><span class="detail-value">${offer.jobTitle || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Department</span><span class="detail-value">${offer.department || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Location</span><span class="detail-value">${offer.location || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Employment Type</span><span class="detail-value">${offer.jobType || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Reporting To</span><span class="detail-value">${offer.reportingTo || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Start Date</span><span class="detail-value">${formatDate(offer.startDate)}</span></div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Compensation</div>
        <div class="details-grid">
          <div class="detail-item"><span class="detail-label">Base Salary</span><span class="detail-value">${formatCurrency(offer.baseSalary)}</span></div>
          <div class="detail-item"><span class="detail-label">Bonus</span><span class="detail-value">${formatCurrency(offer.bonus)}</span></div>
          <div class="detail-item"><span class="detail-label">Equity</span><span class="detail-value">${offer.equity || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Work Schedule</span><span class="detail-value">${offer.workSchedule || 'N/A'}</span></div>
        </div>
        
        ${safeArray(offer.benefits).length > 0 ? `
        <div style="margin-top: 25px;">
          <div class="section-title">Benefits</div>
          <ul class="benefits-list">
            ${safeArray(offer.benefits).map(benefit => `<li>${benefit}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Terms</div>
        <div class="details-grid">
          <div class="detail-item"><span class="detail-label">Probation Period</span><span class="detail-value">${offer.probationPeriod || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Notice Period</span><span class="detail-value">${offer.noticePeriod || 'N/A'}</span></div>
          <div class="detail-item"><span class="detail-label">Offer Expiry</span><span class="detail-value">${formatDate(offer.offerExpiryDate)}</span></div>
          <div class="detail-item"><span class="detail-label">Acceptance Deadline</span><span class="detail-value">${formatDate(offer.acceptanceDeadline)}</span></div>
        </div>
      </div>
      
      ${safeArray(offer.termsAndConditions).length > 0 ? `
      <div class="terms-section">
        <div class="section-title">Terms and Conditions</div>
        <ul>
          ${safeArray(offer.termsAndConditions).map(term => `<li>${term}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${offer.terminationClause ? `
      <div class="section">
        <div class="section-title">Termination</div>
        <div class="content">${offer.terminationClause}</div>
      </div>
      ` : ''}
      
      ${offer.confidentialityClause ? `
      <div class="section">
        <div class="section-title">Confidentiality</div>
        <div class="content">${offer.confidentialityClause}</div>
      </div>
      ` : ''}
      
      ${offer.nonCompeteClause ? `
      <div class="section">
        <div class="section-title">Non-Compete</div>
        <div class="content">${offer.nonCompeteClause}</div>
      </div>
      ` : ''}
      
      ${offer.intellectualPropertyClause ? `
      <div class="section">
        <div class="section-title">Intellectual Property</div>
        <div class="content">${offer.intellectualPropertyClause}</div>
      </div>
      ` : ''}
      
      <div class="content">
        We look forward to having you join our team. Please review this offer and contact us with any questions.
        <br><br>
        Sincerely,
      </div>
      
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-name">${offer.contactPerson || 'HR Representative'}</div>
          <div class="signature-title">${offer.contactPerson ? 'Human Resources' : 'HR Department'}</div>
          <div class="signature-line"></div>
        </div>
        <div class="signature-box">
          <div class="signature-name">${offer.candidateName || 'Candidate Name'}</div>
          <div class="signature-title">Candidate Signature</div>
          <div class="signature-line"></div>
        </div>
      </div>
      
      <div class="footer">
        <strong>Contact Information</strong><br>
        ${offer.contactPerson || 'HR Department'}<br>
        ${offer.contactEmail || 'hr@company.com'}<br>
        ${offer.contactPhone || 'Phone Number'}<br>
        ${offer.companyName || 'Company Name'}<br>
        ${offer.location || 'Company Address'}
      </div>
    </body>
    </html>
  `
}

export const offerTemplates: OfferTemplate[] = [
  formalTemplate,
  modernTemplate,
  minimalistTemplate
]

export const getTemplateById = (id: string): OfferTemplate | undefined => {
  return offerTemplates.find(template => template.id === id)
} 