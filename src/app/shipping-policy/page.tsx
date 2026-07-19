import { PolicyPage } from "@/components/content/policy-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy", description: "Aurora & Co. shipping and delivery policy." };

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      sections={[
        {
          heading: "1. Order Processing",
          body: [
            "All orders are processed within 24 hours of placement (excluding Sundays and public holidays). You will receive an order confirmation email and SMS immediately after placing your order.",
            "Once your order is packed and shipped, you will receive a shipping confirmation with tracking details. Orders are typically shipped within 1-2 business days.",
            "During peak seasons (Diwali, Raksha Bandhan, wedding season), processing may take an additional 1-2 business days due to high order volume.",
          ],
        },
        {
          heading: "2. Shipping Charges",
          body: [
            "We offer FREE shipping on all prepaid orders above ₹999. For orders below ₹999, a flat shipping charge of ₹99 applies.",
            "For Cash on Delivery (COD) orders, an additional COD charge of ₹50 applies. Partial COD orders (10% advance) also incur the ₹50 COD charge.",
            "Shipping charges, if applicable, are clearly displayed at checkout before you place your order.",
          ],
        },
        {
          heading: "3. Delivery Time",
          body: [
            "We ship across India to all 19,000+ PIN codes. Estimated delivery times are:",
            "• Metro cities (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata): 3-5 business days",
            "• Tier 2 cities: 4-6 business days",
            "• Rural and remote areas: 5-8 business days",
            "Delivery times are estimates and may vary due to factors beyond our control such as weather, customs, or courier delays. You can track your order in real-time via the Order Tracking page.",
          ],
        },
        {
          heading: "4. Courier Partners",
          body: [
            "We partner with India's leading courier services including Delhivery, Blue Dart, FedEx, Ecom Express, and XpressBees. The courier is automatically selected based on your location and the fastest available option.",
            "You will receive tracking updates via SMS and email at each stage — packed, shipped, out for delivery, and delivered.",
          ],
        },
        {
          heading: "5. International Shipping",
          body: [
            "Currently, we ship only within India. International shipping is coming soon — please sign up for our newsletter to be notified when we launch international delivery.",
          ],
        },
        {
          heading: "6. Order Tracking",
          body: [
            "You can track your order anytime using our Order Tracking page. Simply enter your order number (e.g., AUR-XYZ123) to see real-time status updates.",
            "For any shipping-related queries, please contact us at hello@aurora-co.in or +91 80000 00000 with your order number.",
          ],
        },
        {
          heading: "7. Delivery Attempts",
          body: [
            "Our courier partners will make up to 3 delivery attempts on consecutive days. If no one is available to receive the package after 3 attempts, the order will be returned to us.",
            "For returned-to-sender orders, we will process a refund (minus shipping charges) within 7 business days of receiving the returned package. You can also request re-shipping by paying the shipping charges again.",
          ],
        },
        {
          heading: "8. Address Accuracy",
          body: [
            "Please ensure your shipping address, PIN code, and mobile number are correct at the time of placing your order. We are not responsible for delays or non-delivery due to incorrect addresses.",
            "If you need to change your address after placing an order, please contact us immediately — we'll do our best to update it before the order is shipped.",
          ],
        },
      ]}
    />
  );
}
