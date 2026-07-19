import { PolicyPage } from "@/components/content/policy-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Aurora & Co. collects, uses, and protects your data." };

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      sections={[
        {
          heading: "1. Information We Collect",
          body: [
            "We collect information you provide directly to us — such as your name, email, mobile number, and shipping address when you create an account, place an order, or contact us.",
            "We also automatically collect certain information about your device and browsing behavior, including IP address, browser type, pages visited, and the dates and times of your visits. This helps us improve our website and provide a better shopping experience.",
            "When you make a purchase, we collect payment information which is processed securely by Razorpay. We do not store your full card details on our servers.",
          ],
        },
        {
          heading: "2. How We Use Your Information",
          body: [
            "We use your information to process and ship your orders, send you order confirmations and tracking updates, respond to your inquiries, and provide customer support.",
            "We may also use your information to send you marketing communications about new products, promotions, and special offers. You can opt out of these communications at any time by clicking the unsubscribe link in our emails or by contacting us.",
            "Your data helps us personalize your shopping experience, recommend products you might like, and improve our website's functionality and performance.",
          ],
        },
        {
          heading: "3. Information Sharing",
          body: [
            "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who help us operate our business — such as payment processors (Razorpay), shipping partners, and email service providers.",
            "These service providers are contractually obligated to protect your information and may only use it to provide services to us. We also comply with legal obligations and may disclose information when required by law.",
          ],
        },
        {
          heading: "4. Data Security",
          body: [
            "We implement industry-standard security measures to protect your personal information, including SSL encryption for all data transmitted between your browser and our servers.",
            "Access to your personal information is restricted to authorized personnel only. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
          ],
        },
        {
          heading: "5. Cookies",
          body: [
            "We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookies through your browser settings.",
            "Essential cookies are necessary for the website to function properly. Analytics cookies help us understand how you use our site. Marketing cookies are used to show you relevant advertisements.",
          ],
        },
        {
          heading: "6. Your Rights",
          body: [
            "You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data.",
            "To exercise these rights, please contact us at hello@aurora-co.in. We will respond to your request within 30 days.",
          ],
        },
        {
          heading: "7. Children's Privacy",
          body: [
            "Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us so we can delete it.",
          ],
        },
        {
          heading: "8. Changes to This Policy",
          body: [
            "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last updated' date.",
            "We encourage you to review this policy periodically to stay informed about how we protect your information.",
          ],
        },
      ]}
    />
  );
}
