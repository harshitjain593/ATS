import { Offer } from '@/lib/types'
import { getTemplateById } from '@/utils/offer-templates'

export const generateOfferLetterPDF = (offer: Offer, templateId: string = 'formal'): void => {
  const template = getTemplateById(templateId)
  if (!template) {
    alert('Template not found')
    return
  }

  const htmlContent = template.generateHTML(offer)
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to download the PDF')
    return
  }
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  setTimeout(() => {
    printWindow.print()
  }, 500)
} 