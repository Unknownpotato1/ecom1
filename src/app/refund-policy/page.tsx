import { PolicyPage } from "@/components/content/policy-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy", description: "Aurora & Co. refund and return policy." };

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund & Return Policy"
      sections={[
        {
          heading: "1. Return Window",
          body: [
            "We offer a 7-day hassle-free return policy from the date of delivery. If you're not completely satisfied with your purchase, you can initiate a return within 7 days of receiving your order.",
            "Items must be unused, unworn, and in their original packaging with all tags and accessories intact. Products that have been altered, resized, or damaged by the customer are not eligible for return.",
            "Certain items such as customized jewelry, gift hampers (once opened), and items marked as 'Final Sale' are not eligible for returns.",
          ],
        },
        {
          heading: "2. How to Initiate a Return",
          body: [
            "To initiate a return, please contact us at hello@aurora-co.in with your order number and the reason for return. You can also call us at +91 80000 00000.",
            "Once your return request is approved, we will send you a return shipping label via email. Pack the items securely in their original packaging and hand them over to the courier.",
            "Please ensure that the items are packed properly to avoid damage during transit. We recommend taking photos of the packed items before shipping.",
          ],
        },
        {
          heading: "3. Refund Processing",
          body: [
            "Once we receive and inspect your returned items, we will process your refund within 5-7 business days. Refunds are processed to the original payment method.",
            "For prepaid orders, the refund will be credited to your bank account, card, or UPI within 5-7 business days, depending on your bank's processing time.",
            "For COD orders, we will refund the amount to your bank account via NEFT/IMPS. Please provide your bank details when initiating the return.",
            "Shipping charges, COD charges, and gift wrapping fees are non-refundable unless the return is due to a defect or error on our part.",
          ],
        },
        {
          heading: "4. Exchange Policy",
          body: [
            "Want a different size, color, or piece? You can exchange your order within 7 days of delivery. Exchanges are subject to availability.",
            "To initiate an exchange, follow the same process as returns and specify the item you'd like to exchange for. Any price difference will be charged or refunded accordingly.",
            "Exchange shipping is free for the first exchange. Subsequent exchanges will incur standard shipping charges.",
          ],
        },
        {
          heading: "5. Damaged or Defective Items",
          body: [
            "If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the product and packaging. We will arrange a free pickup and replacement or full refund.",
            "In rare cases of manufacturing defects discovered after the 7-day window, please contact us — we'll assess the issue and work with you to find a solution.",
          ],
        },
        {
          heading: "6. Cancellations",
          body: [
            "You can cancel your order anytime before it has been shipped. To cancel, go to your order tracking page or contact us with your order number.",
            "Once an order is shipped, it cannot be cancelled — but you can return it after delivery following our standard return process.",
            "Refunds for cancelled orders are processed within 5-7 business days to the original payment method.",
          ],
        },
        {
          heading: "7. Non-Returnable Items",
          body: [
            "The following items are not eligible for return or exchange: customized/personalized jewelry, earrings (for hygiene reasons, unless sealed), gift hampers that have been opened, items marked as 'Final Sale', and items damaged due to customer misuse.",
          ],
        },
      ]}
    />
  );
}
