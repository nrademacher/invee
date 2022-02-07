import { PaymentTerms } from '@prisma/client'

// @link https://www.freshbooks.com/hub/payments/invoice-payment-terms
export function formatPaymentTerms(terms: PaymentTerms): string {
    switch (terms) {
        case PaymentTerms.FIFTEEN_MFI:
            return '15 MFI'
        case PaymentTerms.FIFTY_PERCENT_UPFRONT:
            return '50 Percent Upfront'
        case PaymentTerms.TWO_TEN_NET_30:
            return '2/10 Net 30'
        case PaymentTerms.FIFTY_PERCENT_UPFRONT:
            return '50 Percent Upfront'
        case PaymentTerms.UPON_RECEIPT:
            return 'Upon Receipt'
        case PaymentTerms.NET_7:
        case PaymentTerms.NET_21:
        case PaymentTerms.NET_30:
            return terms[0] + terms.slice(1).replace('_', ' ').toLowerCase()
        case PaymentTerms.CIA:
        case PaymentTerms.PIA:
        case PaymentTerms.EOM:
        default:
            return terms
    }
}
