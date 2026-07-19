import { PolicyPage } from "@/components/content/policy-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", description: "Terms of service for Aurora & Co." };

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      sections={[
        {
          heading: "1. Acceptance of Terms",
          body: [
            "By accessing and using the Aurora & Co. website (aurora-co.in), you agree to be bound by these Terms of Service and all applicable laws and regulations.",
            "If you do not agree with any of these terms, please do not use our website. We may update these terms from time to time, and continued use of the website constitutes acceptance of the updated terms.",
          ],
        },
        {
          heading: "2. Use of the Website",
          body: [
            "You may use our website only for lawful purposes and in accordance with these Terms. You agree not to use the website in any way that could damage, disable, or impair the website or interfere with any other party's use.",
            "You agree not to engage in any activity that could compromise the security of the website, attempt to gain unauthorized access to any part of the website, or use any automated means to scrape or copy content.",
            "All content on this website — including product images, descriptions, logos, and design — is the property of Aurora & Co. and protected by intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.",
          ],
        },
        {
          heading: "3. Product Information",
          body: [
            "We strive to display product images and descriptions as accurately as possible. However, we cannot guarantee that your monitor's display of any color will be accurate, as colors may vary slightly from the actual product due to photography lighting and screen settings.",
            "All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to modify or discontinue any product at any time.",
            "Jewelry weights, dimensions, and stone counts are approximate and may vary slightly due to the handcrafted nature of our products.",
          ],
        },
        {
          heading: "4. Pricing & Payment",
          body: [
            "All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes. We reserve the right to change prices at any time without prior notice.",
            "We accept payments via Razorpay — supporting UPI, credit/debit cards, wallets, and net banking. We also offer Cash on Delivery (COD) and Partial COD options.",
            "For prepaid orders, a 15% discount is automatically applied at checkout. For COD orders, a 10% advance payment is required to confirm the order.",
          ],
        },
        {
          heading: "5. Orders & Cancellations",
          body: [
            "When you place an order, you will receive an order confirmation email. This confirmation does not constitute acceptance of your order — we reserve the right to decline or cancel any order at our discretion.",
            "You can cancel your order anytime before it has been shipped. Once shipped, the order cannot be cancelled but can be returned after delivery per our Refund Policy.",
            "We reserve the right to cancel orders due to pricing errors, inventory issues, suspected fraudulent activity, or any other reason. In such cases, we will refund the full amount paid.",
          ],
        },
        {
          heading: "6. User Accounts",
          body: [
            "When you create an account on our website, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
            "You agree to provide accurate and complete information when creating your account and to update your information as needed. We reserve the suspend or terminate accounts that violate these Terms.",
          ],
        },
        {
          heading: "7. Reviews & User Content",
          body: [
            "If you submit reviews, photos, or other content on our website, you grant us a non-exclusive, royalty-free, perpetual license to use, reproduce, modify, and display that content.",
            "You represent that you own or have the necessary rights to the content you submit, and that the content does not violate any third-party rights or applicable laws. We reserve the right to remove any content at our discretion.",
          ],
        },
        {
          heading: "8. Limitation of Liability",
          body: [
            "Aurora & Co. shall not be liable for any direct, indirect, incidental, punitive, or consequential damages arising from your use of our website or products.",
            "Our total liability for any claim arising from your use of our website or products shall not exceed the amount you paid for the product(s) in question.",
          ],
        },
        {
          heading: "9. Governing Law",
          body: [
            "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.",
          ],
        },
        {
          heading: "10. Contact",
          body: [
            "If you have any questions about these Terms, please contact us at hello@aurora-co.in or +91 80000 00000.",
          ],
        },
      ]}
    />
  );
}
